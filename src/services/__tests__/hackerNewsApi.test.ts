import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HackerNewsAPI } from '../hackerNewsApi';
import { handlers, errorHandlers, mockTopStoryIds, mockStoryData } from './mocks/handlers';

const server = setupServer(...handlers);

describe('HackerNewsAPI with MSW', () => {
  beforeAll(() => server.listen());
  
  afterEach(() => server.resetHandlers());
  
  afterAll(() => server.close());

  describe('Success scenarios', () => {
    it('should fetch top stories successfully', async () => {
      const topStories = await HackerNewsAPI.getTopStories();
      
      expect(topStories).toEqual(mockTopStoryIds);
      expect(Array.isArray(topStories)).toBe(true);
      expect(topStories.length).toBeGreaterThan(0);
    });

    it('should fetch a single story successfully', async () => {
      const story = await HackerNewsAPI.getStory(37484615);
      
      expect(story).toEqual(mockStoryData[37484615]);
      expect(story.id).toBe(37484615);
      expect(story.title).toBe("Sample Project Launch");
      expect(story.score).toBe(150);
    });

    it('should fetch multiple stories successfully', async () => {
      const storyIds = [37484615, 37484323];
      const stories = await HackerNewsAPI.getStories(storyIds);
      
      expect(stories).toHaveLength(2);
      expect(stories[0]).toEqual(mockStoryData[37484615]);
      expect(stories[1]).toEqual(mockStoryData[37484323]);
    });

    it('should handle null stories (deleted items)', async () => {
      const storyIds = [37484615, 999999];
      const stories = await HackerNewsAPI.getStories(storyIds);
      
      expect(stories).toHaveLength(1);
      expect(stories[0]).toEqual(mockStoryData[37484615]);
    });

    it('should fetch paginated top stories with correct structure', async () => {
      const result = await HackerNewsAPI.getPaginatedStories('top', 0, 2);
      
      expect(result).toHaveProperty('stories');
      expect(result).toHaveProperty('hasMore');
      expect(result).toHaveProperty('total');
      expect(result.stories).toHaveLength(2);
      expect(result.hasMore).toBe(true);
      expect(result.total).toBe(mockTopStoryIds.length);
    });

    it('should fetch different story types', async () => {
      const newStories = await HackerNewsAPI.getNewStories();
      const askStories = await HackerNewsAPI.getAskStories();
      const showStories = await HackerNewsAPI.getShowStories();
      const jobs = await HackerNewsAPI.getJobs();
      
      expect(Array.isArray(newStories)).toBe(true);
      expect(Array.isArray(askStories)).toBe(true);
      expect(Array.isArray(showStories)).toBe(true);
      expect(Array.isArray(jobs)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await HackerNewsAPI.getPaginatedStories('top', 0, 2);
      expect(page1.stories).toHaveLength(2);
      expect(page1.hasMore).toBe(true);
      
      const lastPage = await HackerNewsAPI.getPaginatedStories('top', 2, 5);
      expect(lastPage.hasMore).toBe(false);
    });
  });

  describe('Error scenarios', () => {
    it('should handle network errors gracefully', async () => {
      server.use(...errorHandlers);
      
      await expect(HackerNewsAPI.getTopStories())
        .rejects
        .toThrow('Failed to fetch top stories');
    });

    it('should handle invalid story types', async () => {
      await expect(HackerNewsAPI.getPaginatedStories('invalid-type' as any))
        .rejects
        .toThrow('Invalid story type: invalid-type');
    });

    it('should handle story fetch errors', async () => {
      server.use(...errorHandlers);
      
      await expect(HackerNewsAPI.getStory(123))
        .rejects
        .toThrow('Failed to fetch story');
    });

    it('should handle errors when fetching multiple stories', async () => {
      server.use(...errorHandlers);
      
      await expect(HackerNewsAPI.getStories([1, 2, 3]))
        .rejects
        .toThrow('Failed to fetch stories');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty story arrays', async () => {
      const stories = await HackerNewsAPI.getStories([]);
      expect(stories).toEqual([]);
    });

    it('should handle mixed valid/invalid story IDs', async () => {
      const stories = await HackerNewsAPI.getStories([37484615, 999999, 37484323]);
      
      expect(stories).toHaveLength(2);
    });
  });

  describe('Performance and concurrency', () => {
    it('should handle concurrent story requests', async () => {
      const promises = [
        HackerNewsAPI.getStory(37484615),
        HackerNewsAPI.getStory(37484323),
        HackerNewsAPI.getStory(12345)
      ];
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      expect(results[0].id).toBe(37484615);
      expect(results[1].id).toBe(37484323);
      expect(results[2].id).toBe(12345);
    });
  });
});