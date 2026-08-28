import storyDog01 from "@/assets/images/custom/story-dog-01.jpg";
import storyDog02 from "@/assets/images/custom/story-dog-02.png";
import storyDog03 from "@/assets/images/custom/story-dog-03.png";

const STORY_IMAGES = [storyDog01, storyDog02, storyDog03];

const STORY_CONTENT = `‘산책 가자’ 한마디만 들으면 자다가도 벌떡 일어나요.
리드줄을 꺼내는 소리만 나도 현관을 전력 질주하고,
제가 신발을 신기도 전에 빙글빙글 돌며 꼬리를 흔들어요.
너무 신난 나머지 제 신발 한 짝을 물고 도망간 적도 있어요.
매번 정신없지만 그 모습 때문에 꼭 웃게 돼요.`;

export const gardenStories = [
    {
        id: 1,
        image: STORY_IMAGES[0],
        images: STORY_IMAGES,
        title: "산책 한마디에 대소동",
        petName: "루이",
        breed: "골든리트리버",
        age: 8,
        date: "2026.07.15",
        viewCount: 1,
        likeCount: 0,
        content: STORY_CONTENT,
    },
    {
        id: 2,
        image: STORY_IMAGES[0],
        images: STORY_IMAGES,
        title: "먹고가 내게 알려준 것",
        petName: "먹고",
        breed: "코리안숏헤어",
        age: 5,
        date: "2026.07.12",
        viewCount: 38,
        likeCount: 11,
        content: STORY_CONTENT,
    },
    {
        id: 3,
        image: STORY_IMAGES[0],
        images: STORY_IMAGES,
        title: "매일 기다리던 오후 세 시",
        petName: "루이",
        breed: "말티즈",
        age: 10,
        date: "2026.07.09",
        viewCount: 25,
        likeCount: 42,
        content: STORY_CONTENT,
    },
    {
        id: 4,
        image: STORY_IMAGES[0],
        images: STORY_IMAGES,
        title: "우리 집에 처음 온 날",
        petName: "슬한",
        breed: "믹스견",
        age: 3,
        date: "2026.07.03",
        viewCount: 51,
        likeCount: 19,
        content: STORY_CONTENT,
    },
];
