// Simple localStorage-based store for stories, characters, and objects

export interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
  referenceImages?: string[];
}

export interface StoryData {
  id: string;
  title: string;
  style: string;
  outputType: "storyboard" | "animation" | "voiceover";
  language: string;
  frameCount: number;
  imageFormat: string;
  topicType: "Fictional" | "Documentary";
  category: string;
  topic: string;
  consistencyCheck: boolean;
  characters: StoryCharacter[];
  thumbnail?: string;
  createdAt: string;
  folder?: string;
}

export interface AssetCharacter {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  usedIn: number;
  createdAt: string;
}

export interface AssetObject {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  usedIn: number;
  createdAt: string;
}

const STORIES_KEY = "storilyne_stories";
const CHARACTERS_KEY = "storilyne_characters";
const OBJECTS_KEY = "storilyne_objects";

export const getStories = (): StoryData[] => {
  try {
    return JSON.parse(localStorage.getItem(STORIES_KEY) || "[]");
  } catch { return []; }
};

export const saveStory = (story: StoryData) => {
  const stories = getStories();
  stories.unshift(story);
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
};

export const deleteStory = (id: string) => {
  const stories = getStories().filter(s => s.id !== id);
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
};

export const getCharacters = (): AssetCharacter[] => {
  try {
    return JSON.parse(localStorage.getItem(CHARACTERS_KEY) || "[]");
  } catch { return []; }
};

export const saveCharacter = (char: AssetCharacter) => {
  const chars = getCharacters();
  chars.unshift(char);
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars));
};

export const deleteCharacter = (id: string) => {
  const chars = getCharacters().filter(c => c.id !== id);
  localStorage.setItem(CHARACTERS_KEY, JSON.stringify(chars));
};

export const getObjects = (): AssetObject[] => {
  try {
    return JSON.parse(localStorage.getItem(OBJECTS_KEY) || "[]");
  } catch { return []; }
};

export const saveObject = (obj: AssetObject) => {
  const objs = getObjects();
  objs.unshift(obj);
  localStorage.setItem(OBJECTS_KEY, JSON.stringify(objs));
};

export const deleteObject = (id: string) => {
  const objs = getObjects().filter(o => o.id !== id);
  localStorage.setItem(OBJECTS_KEY, JSON.stringify(objs));
};

export const generateId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
