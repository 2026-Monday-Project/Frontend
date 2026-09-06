import { createContext, useContext } from "react";

export const StoryFormContext = createContext(null);

export const useStoryForm = () => {
  const context = useContext(StoryFormContext);

  if (!context) {
    throw new Error(
      "useStoryForm은 StoryFormLayout 내부에서만 사용할 수 있어요.",
    );
  }

  return context;
};
