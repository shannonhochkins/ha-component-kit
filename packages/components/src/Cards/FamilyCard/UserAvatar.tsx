type UserAvatarProps = {
  userImage?: string;
};

export const UserAvatar = ({ userImage }: UserAvatarProps) => {
  return <img src={userImage} className="user-avatar user-avatar--image" />;
};
