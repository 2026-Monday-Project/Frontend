import StoryCard from "@/components/common/StoryCard";

import "./GardenStoryList.css";

const GardenStoryList = ({ stories, onStoryClick }) => {
    return (
        <div className="garden-story-list">
            {stories.map((story) => (
                <StoryCard
                    key={story.id}
                    image={story.image}
                    title={story.title}
                    petName={story.petName}
                    breed={story.breed}
                    age={story.age}
                    date={story.date}
                    viewCount={story.viewCount}
                    likeCount={story.likeCount}
                    onClick={() => onStoryClick(story.id)}
                />
            ))}
        </div>
    );
};

export default GardenStoryList;
