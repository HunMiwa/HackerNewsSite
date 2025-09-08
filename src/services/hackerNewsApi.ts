import axios from 'axios';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export class HackerNewsAPI {
  static async getTopStories() {
    try {
      const response = await api.get('/topstories.json');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch top stories: ${error.message}`);
    }
  }

  static async getNewStories() {
    try {
      const response = await api.get('/newstories.json');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch new stories: ${error.message}`);
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
        storyIds = await this.getTopStories();
      } else if (type === 'new') {
        storyIds = await this.getNewStories();
      } else if (type === 'ask') {
        storyIds = await this.getAskStories();
      } else if (type === 'show') {
        storyIds = await this.getShowStories();
      } else if (type === 'jobs') {
        storyIds = await this.getJobs();
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

  static async getComments(storyId) {
    try {
      const story = await this.getStory(storyId);
      if (!story || !story.kids || story.kids.length === 0) {
        return [];
      }

      const commentPromises = story.kids.map(commentId => this.getStory(commentId));
      const comments = await Promise.all(commentPromises);

      return comments.filter(comment => comment && comment.type === 'comment');
    } catch (error: any) {
      throw new Error(`Failed to fetch comments for story ${storyId}: ${error.message}`);
    }
  }

  static async getPaginatedComments(storyId, page = 0, limit = 10) {
    try {
      const story = await this.getStory(storyId);
      if (!story || !story.kids || story.kids.length === 0) {
        return { comments: [], hasMore: false, total: 0 };
      }
      
      const commentIds = story.kids;
      const startIndex = page * limit;
      const endIndex = startIndex + limit;
      const pageCommentIds = commentIds.slice(startIndex, endIndex);

      const commentPromises = pageCommentIds.map(commentId => this.getStory(commentId));
      const comments = await Promise.all(commentPromises);

      const validComments = comments.filter(comment => comment && comment.type === 'comment');
      
      return {
        comments: validComments,
        hasMore: endIndex < commentIds.length,
        total: commentIds.length
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch paginated comments for story ${storyId}: ${error.message}`);
    }
  }

  static async getJobs() {
    try {
      const response = await api.get('/jobstories.json');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch job stories: ${error.message}`);
    }
  }

  static async getAskStories() {
    try {
      const response = await api.get('/askstories.json');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch ask stories: ${error.message}`);
    }
  }

  static async getShowStories() {
    try {
      const response = await api.get('/showstories.json');
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch show stories: ${error.message}`);
    }
  }
}
