import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { StoryFormContext } from "@/pages/StoryForm/storyFormContext";

const INITIAL_INFO = {
  petName: "",
  petAge: "",
  petType: "",
  nickname: "",
  email: "",
};

const INITIAL_STORY = {
  title: "",
  content: "",
  photos: [],
};

const INITIAL_CONSENTS = {
  privacy: false,
  content: false,
  website: false,
  intro: false,
  sns: false,
};

const buildEditState = (source) => ({
  info: {
    petName: source.petName ?? "",
    petAge: String(source.petAge ?? ""),
    petType: source.petType ?? "",
    nickname: source.nickname ?? "",
    email: source.email ?? "",
  },
  story: {
    title: source.title ?? "",
    content: source.content ?? "",
    photos: (source.images ?? []).map((image) => ({
      id: `existing-${image.imageId}`,
      imageId: image.imageId,
      url: image.imageUrl,
    })),
  },
  consents: {
    privacy: true,
    content: true,
    website: true,
    intro: Boolean(source.introduceConsent),
    sns: Boolean(source.snsConsent),
  },
});

const StoryFormLayout = () => {
  const location = useLocation();

  // 수정 진입 시에는 진입 화면이 넘겨준 사연 데이터(location.state.editStory)로만 초기화한다.
  // 주소로 직접 접근해 데이터가 없으면 빈 상태로 두고, 제출은 StoryForm3에서 차단한다.
  const [seed] = useState(() => {
    if (!location.pathname.startsWith("/story/edit")) return null;
    if (!location.state?.editStory) return null;
    return buildEditState(location.state.editStory);
  });

  const [info, setInfo] = useState(seed ? seed.info : INITIAL_INFO);
  const [story, setStory] = useState(seed ? seed.story : INITIAL_STORY);
  const [consents, setConsents] = useState(
    seed ? seed.consents : INITIAL_CONSENTS,
  );

  const value = useMemo(
    () => ({
      info,
      setInfo,
      story,
      setStory,
      consents,
      setConsents,
      reset: () => {
        story.photos.forEach((photo) => {
          if (photo.file && photo.url) URL.revokeObjectURL(photo.url);
        });

        setInfo(INITIAL_INFO);
        setStory(INITIAL_STORY);
        setConsents(INITIAL_CONSENTS);
      },
    }),
    [info, story, consents],
  );

  return (
    <StoryFormContext.Provider value={value}>
      <Outlet />
    </StoryFormContext.Provider>
  );
};

export default StoryFormLayout;
