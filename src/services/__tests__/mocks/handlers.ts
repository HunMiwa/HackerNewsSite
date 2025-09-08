import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const mockTopStoryIds = [37484615, 37484323, 37483842, 37483654, 37483021];
export const mockStoryData = {
  37484615: {
    id: 37484615,
    title: "Sample Project Launch",
    url: "https://example.com",
    score: 150,
    by: "testuser",
    time: 1704067200,
    descendants: 25,
    type: "story"
  },
  37484323: {
    id: 37484323,
    title: "Programming Language Discussion",
    score: 89,
    by: "curious_dev",
    time: 1704066000,
    descendants: 45,
    type: "story"
  }
};

export const handlers = [
  http.get(`${BASE_URL}/topstories.json`, () => {
    return HttpResponse.json(mockTopStoryIds);
  }),

  http.get(`${BASE_URL}/newstories.json`, () => {
    return HttpResponse.json([37484700, 37484650, 37484600]);
  }),

  http.get(`${BASE_URL}/askstories.json`, () => {
    return HttpResponse.json([37484323, 37484200]);
  }),

  http.get(`${BASE_URL}/showstories.json`, () => {
    return HttpResponse.json([37484615, 37484500]);
  }),

  http.get(`${BASE_URL}/jobstories.json`, () => {
    return HttpResponse.json([37484800, 37484750]);
  }),

  http.get(`${BASE_URL}/item/:id.json`, ({ params }) => {
    const { id } = params;
    const storyId = Number(id);
    
    if (mockStoryData[storyId]) {
      return HttpResponse.json(mockStoryData[storyId]);
    }
    
    if (storyId === 999999) {
      return HttpResponse.json(null);
    }
    
    return HttpResponse.json({
      id: storyId,
      title: `Story ${storyId}`,
      url: `https://example.com/${storyId}`,
      score: Math.floor(Math.random() * 100),
      by: "user",
      time: Date.now() / 1000,
      descendants: Math.floor(Math.random() * 50),
      type: "story"
    });
  }),

  http.get(`${BASE_URL}/error-test.json`, () => {
    return HttpResponse.error();
  }),
];

export const errorHandlers = [
  http.get(`${BASE_URL}/topstories.json`, () => {
    return HttpResponse.error();
  }),
  http.get(`${BASE_URL}/item/:id.json`, () => {
    return HttpResponse.error();
  }),
];