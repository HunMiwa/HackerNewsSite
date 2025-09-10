import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export class HackerNewsAPI {

  static async getStoriesByType(type: string) {
    try {
      const response = await api.get(`/${type}stories.json`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }
  }

  static async getStory(id) {
    try {
      const response = await api.get(`/item/${id}.json`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch story ${id}: ${error.message}`);
    }
  }

  static async getStories(ids) {
    try {
      const storyPromises = ids.map(id => this.getStory(id));
      const stories = await Promise.all(storyPromises);
      return stories.filter(story => story !== null);
    } catch (error: any) {
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }
  }

  static async getPaginatedStories(type = 'top', page = 0, limit = 30) {
    try {

      let storyIds;
      if (type === 'top') {
        storyIds = await this.getStoriesByType(type);
      } else if (type === 'new') {
        storyIds = await this.getStoriesByType(type);
      } else if (type === 'ask') {
        storyIds = await this.getStoriesByType(type);
      } else if (type === 'show') {
        storyIds = await this.getStoriesByType(type);
      } else if (type === 'jobs') {
        storyIds = await this.getStoriesByType(type);
      } else {
        throw new Error(`Invalid story type: ${type}`);
      }
      
      const startIndex = page * limit;
      const endIndex = startIndex + limit;
      const pageIds = storyIds.slice(startIndex, endIndex);
      
      const stories = await this.getStories(pageIds);
      
      return {
        stories,
        hasMore: endIndex < storyIds.length,
        total: storyIds.length
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch paginated stories: ${error.message}`);
    }
  }

  static async getAllComments(storyId) {
    try {
      const story = await this.getStory(storyId);
      if (!story || !story.kids || story.kids.length === 0) {
        return { comments: [], hasMore: false, total: 0 };
      }
      
      const commentIds = story.kids;

      const commentPromises = commentIds.map(commentId => this.getStory(commentId));
      const comments = await Promise.all(commentPromises);

      const validComments = comments.filter(comment => comment && comment.type === 'comment');
      
      return {
        comments: validComments,
        total: commentIds.length
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch paginated comments for story ${storyId}: ${error.message}`);
    }
  }
}
