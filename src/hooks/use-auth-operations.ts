
import { User, UserProfile, ProfileData, Message } from '@/types/auth';
import { useAuthSignIn } from './use-auth-signin';
import { useProfileUpdate } from './use-profile-update';
import { useMessaging } from './use-messaging';

export function useAuthOperations(
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  allMessages: Message[],
  setAllMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsUpdatingProfile: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Use our new modular hooks
  const authSignIn = useAuthSignIn(setUser);
  const profileUpdate = useProfileUpdate(user, setUser, setIsUpdatingProfile);
  const messaging = useMessaging(user, allMessages, setAllMessages);

  // Return all the functions from our modular hooks
  return {
    ...authSignIn,
    ...profileUpdate,
    ...messaging
  };
}
