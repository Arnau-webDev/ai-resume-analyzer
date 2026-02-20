import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;
  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };
  fs: {
    write: (
      path: string,
      data: string | File | Blob
    ) => Promise<File | undefined>;
    read: (path: string) => Promise<Blob | undefined>;
    upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
    delete: (path: string) => Promise<void>;
    readDir: (path: string) => Promise<FSItem[] | undefined>;
  };
  ai: {
    chat: (
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ) => Promise<AIResponse | undefined>;
    feedback: (
      resumeText: string,
      message: string
    ) => Promise<AIResponse | undefined>;
    img2txt: (
      image: string | File | Blob,
      testMode?: boolean
    ) => Promise<string | undefined>;
  };
  kv: {
    get: (key: string) => Promise<string | null | undefined>;
    set: (key: string, value: string) => Promise<boolean | undefined>;
    delete: (key: string) => Promise<boolean | undefined>;
    list: (
      pattern: string,
      returnValues?: boolean
    ) => Promise<string[] | KVItem[] | undefined>;
    flush: () => Promise<boolean | undefined>;
  };

  init: () => void;
  clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>()(
  devtools(
    (set, get) => {
      const setError = (msg: string, action?: string) => {
        set(
          {
            error: msg,
            isLoading: false,
            auth: {
              user: null,
              isAuthenticated: false,
              signIn: get().auth.signIn,
              signOut: get().auth.signOut,
              refreshUser: get().auth.refreshUser,
              checkAuthStatus: get().auth.checkAuthStatus,
              getUser: get().auth.getUser,
            },
          },
          undefined,
          action || "error/set"
        );
      };

      const checkAuthStatus = async (): Promise<boolean> => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "auth/checkStatus/error");
          return false;
        }

        set({ isLoading: true, error: null }, undefined, "auth/checkStatus/loading");

        try {
          const isSignedIn = await puter.auth.isSignedIn();
          if (isSignedIn) {
            const user = await puter.auth.getUser();
            set(
              {
                auth: {
                  user,
                  isAuthenticated: true,
                  signIn: get().auth.signIn,
                  signOut: get().auth.signOut,
                  refreshUser: get().auth.refreshUser,
                  checkAuthStatus: get().auth.checkAuthStatus,
                  getUser: () => user,
                },
                isLoading: false,
              },
              undefined,
              "auth/checkStatus/authenticated"
            );
            return true;
          } else {
            set(
              {
                auth: {
                  user: null,
                  isAuthenticated: false,
                  signIn: get().auth.signIn,
                  signOut: get().auth.signOut,
                  refreshUser: get().auth.refreshUser,
                  checkAuthStatus: get().auth.checkAuthStatus,
                  getUser: () => null,
                },
                isLoading: false,
              },
              undefined,
              "auth/checkStatus/unauthenticated"
            );
            return false;
          }
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Failed to check auth status";
          setError(msg, "auth/checkStatus/error");
          return false;
        }
      };

      const signIn = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "auth/signIn/error");
          return;
        }

        set({ isLoading: true, error: null }, undefined, "auth/signIn/loading");

        try {
          await puter.auth.signIn();
          await checkAuthStatus();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Sign in failed";
          setError(msg, "auth/signIn/error");
        }
      };

      const signOut = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "auth/signOut/error");
          return;
        }

        set({ isLoading: true, error: null }, undefined, "auth/signOut/loading");

        try {
          await puter.auth.signOut();
          set(
            {
              auth: {
                user: null,
                isAuthenticated: false,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: () => null,
              },
              isLoading: false,
            },
            undefined,
            "auth/signOut/success"
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Sign out failed";
          setError(msg, "auth/signOut/error");
        }
      };

      const refreshUser = async (): Promise<void> => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "auth/refreshUser/error");
          return;
        }

        set({ isLoading: true, error: null }, undefined, "auth/refreshUser/loading");

        try {
          const user = await puter.auth.getUser();
          set(
            {
              auth: {
                user,
                isAuthenticated: true,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: () => user,
              },
              isLoading: false,
            },
            undefined,
            "auth/refreshUser/success"
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to refresh user";
          setError(msg, "auth/refreshUser/error");
        }
      };

      const init = (): void => {
        const puter = getPuter();
        if (puter) {
          set({ puterReady: true }, undefined, "init/puterReady");
          checkAuthStatus();
          return;
        }

        const interval = setInterval(() => {
          if (getPuter()) {
            clearInterval(interval);
            set({ puterReady: true }, undefined, "init/puterReady");
            checkAuthStatus();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          if (!getPuter()) {
            setError("Puter.js failed to load within 10 seconds", "init/timeout");
          }
        }, 10000);
      };

      const write = async (path: string, data: string | File | Blob) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "fs/write/error");
          return;
        }
        return puter.fs.write(path, data);
      };

      const readDir = async (path: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "fs/readDir/error");
          return;
        }
        return puter.fs.readdir(path);
      };

      const readFile = async (path: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "fs/read/error");
          return;
        }
        return puter.fs.read(path);
      };

      const upload = async (files: File[] | Blob[]) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "fs/upload/error");
          return;
        }
        return puter.fs.upload(files);
      };

      const deleteFile = async (path: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "fs/delete/error");
          return;
        }
        return puter.fs.delete(path);
      };

      const chat = async (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
      ) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "ai/chat/error");
          return;
        }
        return puter.ai.chat(prompt, imageURL, testMode, options) as Promise<
          AIResponse | undefined
        >;
      };

      const feedback = async (resumeText: string, message: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "ai/feedback/error");
          return;
        }

        return puter.ai.chat(
          `Here is the resume content:\n\n${resumeText}\n\n${message}`,
          { model: "openai/gpt-5.2-chat" }
        ) as Promise<AIResponse | undefined>;
      };

      const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "ai/img2txt/error");
          return;
        }
        return puter.ai.img2txt(image, testMode);
      };

      const getKV = async (key: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "kv/get/error");
          return;
        }
        return puter.kv.get(key);
      };

      const setKV = async (key: string, value: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "kv/set/error");
          return;
        }
        return puter.kv.set(key, value);
      };

      const deleteKV = async (key: string) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "kv/delete/error");
          return;
        }
        return puter.kv.delete(key);
      };

      const listKV = async (pattern: string, returnValues?: boolean) => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "kv/list/error");
          return;
        }
        if (returnValues === undefined) {
          returnValues = false;
        }
        return puter.kv.list(pattern, returnValues);
      };

      const flushKV = async () => {
        const puter = getPuter();
        if (!puter) {
          setError("Puter.js not available", "kv/flush/error");
          return;
        }
        return puter.kv.flush();
      };

      return {
        isLoading: true,
        error: null,
        puterReady: false,
        auth: {
          user: null,
          isAuthenticated: false,
          signIn,
          signOut,
          refreshUser,
          checkAuthStatus,
          getUser: () => get().auth.user,
        },
        fs: {
          write: (path: string, data: string | File | Blob) => write(path, data),
          read: (path: string) => readFile(path),
          readDir: (path: string) => readDir(path),
          upload: (files: File[] | Blob[]) => upload(files),
          delete: (path: string) => deleteFile(path),
        },
        ai: {
          chat: (
            prompt: string | ChatMessage[],
            imageURL?: string | PuterChatOptions,
            testMode?: boolean,
            options?: PuterChatOptions
          ) => chat(prompt, imageURL, testMode, options),
          feedback: (path: string, message: string) => feedback(path, message),
          img2txt: (image: string | File | Blob, testMode?: boolean) =>
            img2txt(image, testMode),
        },
        kv: {
          get: (key: string) => getKV(key),
          set: (key: string, value: string) => setKV(key, value),
          delete: (key: string) => deleteKV(key),
          list: (pattern: string, returnValues?: boolean) =>
            listKV(pattern, returnValues),
          flush: () => flushKV(),
        },
        init,
        clearError: () => set({ error: null }, undefined, "error/clear"),
      };
    },
    { name: "PuterStore" }
  )
);