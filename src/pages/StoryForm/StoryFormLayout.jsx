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

// 닉네임/이메일 중복 확인 통과 여부. 스텝 이동(이전/다음)에도 유지되도록 컨텍스트에 보관한다.
const INITIAL_VERIFIED = {
  nickname: false,
  email: false,
};

// 사연 상세 응답의 이미지 표현이 두 가지라 모두 흡수한다.
//  1) images: [{ imageId, imageUrl }]
//  2) imageUrls: string[]  (+ 있으면 imageIds: number[])
const toEditPhotos = (source) => {
  if (Array.isArray(source.images) && source.images.length > 0) {
    return source.images.map((image) => ({
      id: `existing-${image.imageId ?? image.imageUrl}`,
      imageId: image.imageId ?? null,
      url: image.imageUrl ?? image.url,
    }));
  }

  if (Array.isArray(source.imageUrls) && source.imageUrls.length > 0) {
    const ids = Array.isArray(source.imageIds) ? source.imageIds : [];
    return source.imageUrls.map((url, index) => ({
      id: `existing-${ids[index] ?? url}`,
      imageId: ids[index] ?? null,
      url,
    }));
  }

  return [];
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
    photos: toEditPhotos(source),
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
  const [verified, setVerified] = useState(INITIAL_VERIFIED);

  const value = useMemo(
    () => ({
      info,
      setInfo,
      story,
      setStory,
      consents,
      setConsents,
      verified,
      setVerified,
      reset: () => {
        story.photos.forEach((photo) => {
          if (photo.file && photo.url) URL.revokeObjectURL(photo.url);
        });

        setInfo(INITIAL_INFO);
        setStory(INITIAL_STORY);
        setConsents(INITIAL_CONSENTS);
        setVerified(INITIAL_VERIFIED);
      },
    }),
    [info, story, consents, verified],
  );

  return (
    <StoryFormContext.Provider value={value}>
      <Outlet />
    </StoryFormContext.Provider>
  );
};

export default StoryFormLayout;
