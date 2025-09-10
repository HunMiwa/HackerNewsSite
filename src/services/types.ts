export type Story = {
    id: number;
    title: string;
    url: string;
    score: number;
    by: string;
    time: number;
    descendants: number;
}

export interface Comment {
    id: number;
    by: string;
    time: number;
    text: string;
    kids?: number[];
}

export interface NavItem {
    id: string;
    title: string;
}

export interface RepliesCardProps {
    comment: Comment;
    level: number;
  }