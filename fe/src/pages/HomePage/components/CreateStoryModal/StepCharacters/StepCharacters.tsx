import { useState, useEffect } from "react";
import CharactersSkeleton from "./CharactersSkeleton";
import CharactersListView from "./CharactersListView";
import CharacterDetailView from "./CharacterDetailView";
import type { CreateStoryFormData, CharacterItem } from "../types";
import { MOCK_INITIAL_CHARACTERS } from "../mockData";
import { PLACEHOLDER_IMAGE } from "@/lib/placeholderImage";

interface StepCharactersProps {
  formData: CreateStoryFormData;
  onFormDataChange: React.Dispatch<React.SetStateAction<CreateStoryFormData>>;
}

export default function StepCharacters({ formData, onFormDataChange }: StepCharactersProps) {
  const [viewState, setViewState] = useState<"skeleton" | "list" | "detail">("skeleton");
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Initialize characters and simulate 1.5s AI scan
  useEffect(() => {
    if (!formData.characters || formData.characters.length === 0) {
      onFormDataChange((prev) => ({
        ...prev,
        characters: MOCK_INITIAL_CHARACTERS,
      }));
    }

    const timer = setTimeout(() => {
      setViewState("list");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectCharacter = (char: CharacterItem) => {
    setSelectedCharacterId(char.id);
    setViewState("detail");
  };

  const handleUpdateCharacter = (updated: CharacterItem) => {
    onFormDataChange((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const handleDeleteCharacter = (id: string) => {
    onFormDataChange((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== id),
    }));
    if (selectedCharacterId === id) {
      setSelectedCharacterId(null);
      setViewState("list");
    }
  };

  const handleAddCharacter = () => {
    const newChar: CharacterItem = {
      id: `char-${Date.now()}`,
      name: "Nhân vật mới",
      description: "Nhân vật phụ bổ sung từ kịch bản...",
      previewLine: "Nhập dòng thoại mẫu để nghe thử giọng đọc...",
      voiceId: undefined,
      voiceName: undefined,
      avatarUrl: PLACEHOLDER_IMAGE,
    };

    onFormDataChange((prev) => ({
      ...prev,
      characters: [...prev.characters, newChar],
    }));
    setSelectedCharacterId(newChar.id);
    setViewState("detail");
  };

  if (viewState === "skeleton") {
    return <CharactersSkeleton />;
  }

  const selectedCharacter = formData.characters.find((c) => c.id === selectedCharacterId);

  if (viewState === "detail" && selectedCharacter) {
    return (
      <CharacterDetailView
        character={selectedCharacter}
        onBack={() => {
          setSelectedCharacterId(null);
          setViewState("list");
        }}
        onUpdateCharacter={handleUpdateCharacter}
      />
    );
  }

  return (
    <CharactersListView
      characters={formData.characters}
      onSelectCharacter={handleSelectCharacter}
      onDeleteCharacter={handleDeleteCharacter}
      onAddCharacter={handleAddCharacter}
    />
  );
}
