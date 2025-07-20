import { AiOutlineChrome } from 'react-icons/ai';
import { Button } from '@/components/ui/button';

export const DownloadExtension = () => {
  return (
    <Button
      className="w-fit mt-4"
      onClick={() => {
        window.open(
          'https://chromewebstore.google.com/detail/amhjldbacojfmlcbhjlpnnnjokcfakjp/',
          '_blank'
        );
      }}
      variant="outline"
    >
      <AiOutlineChrome className="size-4" />
      Download Extension
    </Button>
  );
};
