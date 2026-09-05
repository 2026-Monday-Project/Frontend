import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { StoryFormContext } from "@/pages/StoryForm/storyFormContext";
import puppyRunningImg from "@/assets/images/custom/puppy-running.svg";

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

// TODO: 사연 상세 조회 API가 나오면 이 목데이터를 실제 응답으로 교체
const EDIT_MOCK_STORY = {
  petName: "루이",
  petAge: "8",
  petType: "골든리트리버",
  nickname: "참쮸",
  email: "pdjfd4844@gmail.com",
  title: "산책 한마디에 대소동",
  content:
    "‘산책 가자’ 한마디만 들으면 자다가도 벌떡 일어나요. 리드줄을 꺼내는 소리에 나도 현관을 전력 질주하고, 제가 신발을 신기도 전에 빙글빙글 돌며 꼬리를 흔들어요.",
  images: [
    { imageId: 1, imageUrl: puppyRunningImg },
    { imageId: 2, imageUrl: puppyRunningImg },
  ],
  introduceConsent: true,
  snsConsent: false,
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

  const [seed] = useState(() => {
    if (!location.pathname.startsWith("/story/edit")) return null;
    return buildEditState(location.state?.editStory ?? EDIT_MOCK_STORY);
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
