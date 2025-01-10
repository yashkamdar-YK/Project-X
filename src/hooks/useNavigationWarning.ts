import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUnsavedChangesStore } from '@/lib/store/unsavedChangesStore';

export const useNavigationWarning = () => {
  const router = useRouter();
  const { isUnsaved } = useUnsavedChangesStore();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // Handle beforeunload event (browser close/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUnsaved) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUnsaved]);

  // Handle navigation with confirmation
  const handleNavigation = useCallback((path: string) => {
    if (isUnsaved) {
      setPendingPath(path);
      setShowDialog(true);
    } else {
      router.push(path);
    }
  }, [router, isUnsaved]);

  // Handle confirmation dialog response
  const handleConfirm = useCallback(() => {
    if (pendingPath) {
      router.push(pendingPath);
    }
    setShowDialog(false);
    setPendingPath(null);
  }, [pendingPath, router]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
    setPendingPath(null);
  }, []);

  return { 
    handleNavigation, 
    showDialog, 
    handleConfirm, 
    handleCancel 
  };
};