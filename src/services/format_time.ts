const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000) as any;
    const now = new Date() as any;
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 2) {
      return `${Math.floor(diffInHours)} hour ago`;
    }
    else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
};

export default formatTime;