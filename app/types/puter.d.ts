interface PuterUser {
  username: string;
  uuid: string;
  email?: string;
}

interface FSItem {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
  created?: string;
  modified?: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

interface ChatMessageContent {
  type: "text" | "file" | "image_url";
  text?: string;
  puter_path?: string;
  image_url?: { url: string };
}

interface PuterChatOptions {
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface AIResponse {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface KVItem {
  key: string;
  value: string;
}

interface Window {
  puter: {
    auth: {
      getUser: () => Promise<PuterUser>;
      isSignedIn: () => Promise<boolean>;
      signIn: () => Promise<void>;
      signOut: () => Promise<void>;
    };
    fs: {
      write: (
        path: string,
        data: string | File | Blob
      ) => Promise<File | undefined>;
      read: (path: string) => Promise<Blob>;
      upload: (file: File[] | Blob[]) => Promise<FSItem>;
      delete: (path: string) => Promise<void>;
      readdir: (path: string) => Promise<FSItem[] | undefined>;
    };
    ai: {
      chat: (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
      ) => Promise<Object>;
      img2txt: (
        image: string | File | Blob,
        testMode?: boolean
      ) => Promise<string>;
    };
    kv: {
      get: (key: string) => Promise<string | null>;
      set: (key: string, value: string) => Promise<boolean>;
      delete: (key: string) => Promise<boolean>;
      list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
      flush: () => Promise<boolean>;
    };
  };
}
