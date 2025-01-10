import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check, Phone, Linkedin, Twitter, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { backtestService } from '../../../_actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ShareDialogProps {
  strategy: string;
  runid: string;
  visibility: string;
}

type SocialPlatform = 'whatsapp' | 'twitter' | 'linkedin';

interface SocialLinks {
  [key: string]: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ strategy, runid, visibility }) => {
  const { toast } = useToast();
  const [isPublic, setIsPublic] = useState<boolean>(visibility === 'public');
  const [shareableLink, setShareableLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Fetch initial shareable link if visibility is public
  useEffect(() => {
    const fetchInitialLink = async () => {
      if (visibility === 'public' && isOpen) {
        setIsLoading(true);
        try {
          const result = await backtestService.generatePublicURL(strategy, runid);
          const fullUrl = `${window.location.origin}/backtest/${result.encr}`;
          setShareableLink(fullUrl);
        } catch (err) {
          console.error('Failed to fetch initial link:', err);
          setError("Failed to fetch sharing link");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInitialLink();
  }, [visibility, strategy, runid, isOpen]);

  const handleVisibilityChange = async (checked: boolean): Promise<void> => {
    setIsSwitchLoading(true);
    setError("");
    
    try {
      const newVisibility = checked ? 'public' : 'private';
      await backtestService.changeVisibility(strategy, runid, newVisibility);
      
      setIsPublic(checked);
      
      if (checked) {
        const result = await backtestService.generatePublicURL(strategy, runid);
        const fullUrl = `${window.location.origin}/share/${result.encr}`;
        setShareableLink(fullUrl);
        toast({
          title: "Visibility changed",
          description: "Your strategy results are now public and can be shared",
        });
      } else {
        setShareableLink("");
        toast({
          title: "Visibility changed",
          description: "Your strategy results are now private",
        });
      }
    } catch (err) {
      console.error('Visibility change failed:', err);
      setError(err instanceof Error ? err.message : "Failed to change visibility");
      setIsPublic(!checked); // Revert the switch state
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to change visibility settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      setError("Failed to copy to clipboard");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard",
      });
    }
  };

  const shareToSocial = (platform: SocialPlatform): void => {
    const text = `Check out this trading strategy backtest results!`;
    const url = encodeURIComponent(shareableLink);
    
    const links: SocialLinks = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareableLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
          aria-label="Share strategy results"
        >
          <Share2 className="h-4 w-4" />
          {isPublic && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Strategy Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <Label htmlFor="public">Make Results Public</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view your strategy results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isSwitchLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={handleVisibilityChange}
                disabled={isSwitchLoading}
              />
            </div>
          </div>

          {isPublic && (
            <div className="space-y-4 animate-in fade-in-50 slide-in-from-top-5">
              <div className="space-y-2">
                <Label>Shareable Link</Label>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      value={shareableLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="shrink-0"
                      disabled={!shareableLink}
                      aria-label={copied ? "Copied!" : "Copy to clipboard"}
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Share on Social Media</Label>
                <div className="flex justify-start space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shareToSocial('whatsapp')}
                    className="bg-green-50 hover:bg-green-100 transition-colors"
                    disabled={!shareableLink}
                    aria-label="Share on WhatsApp"
                  >
                    {/* <WhatsAppIcon className="h-4 w-4 text-green-600" /> */}
                    <Image
                      src="/icons/whatsapp.svg"
                      alt="WhatsApp"
                      width={16}
                      height={16}
                      className="h-4 w-4 text-green-600"
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shareToSocial('twitter')}
                    className="bg-blue-50 hover:bg-blue-100 transition-colors"
                    disabled={!shareableLink}
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shareToSocial('linkedin')}
                    className="bg-blue-50 hover:bg-blue-100 transition-colors"
                    disabled={!shareableLink}
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;