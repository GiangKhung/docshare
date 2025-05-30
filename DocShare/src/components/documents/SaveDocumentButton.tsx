"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FiBookmark, FiCheck } from "react-icons/fi";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { Folder } from "@/types";
import { saveDocument, removeSavedDocument, isDocumentSaved, getFolders } from "@/lib/saved-document-service";

interface SaveDocumentButtonProps {
  documentId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function SaveDocumentButton({
  documentId,
  variant = "outline",
  size = "icon",
  className = "",
}: SaveDocumentButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);

  // Kiểm tra xem tài liệu đã được lưu chưa
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;
      
      try {
        const isSaved = await isDocumentSaved(user.id);
        setSaved(isSaved);
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái lưu:", error);
      }
    };

    checkSavedStatus();
  }, [documentId, user]);

  // Lấy danh sách thư mục
  const loadFolders = async () => {
    if (!user) return;
    
    try {
      const userFolders = await getFolders();
      setFolders(userFolders);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thư mục:", error);
    }
  };

  const handleSaveClick = async () => {
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để lưu tài liệu này.",
        variant: "destructive",
      });
      return;
    }

    if (saved) {
      // Nếu đã lưu, xóa khỏi danh sách đã lưu
      setLoading(true);
      try {
        await removeSavedDocument(user.id);
        setSaved(false);
        toast({
          title: "Đã xóa khỏi danh sách đã lưu",
          description: "Tài liệu đã được xóa khỏi danh sách đã lưu của bạn.",
        });
      } catch (error) {
        console.error("Lỗi khi xóa tài liệu đã lưu:", error);
        toast({
          title: "Lỗi",
          description: "Không thể xóa tài liệu khỏi danh sách đã lưu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Nếu chưa lưu, hiển thị dialog để chọn thư mục
      await loadFolders();
      setShowDialog(true);
    }
  };

  const handleSaveToFolder = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Nếu giá trị là 'none' hoặc không hợp lệ, truyền null thay vì undefined
      // Supabase sẽ chuyển null thành NULL trong SQL, phù hợp với folderid có thể NULL
      let folderIdToSave = null;
      
      if (selectedFolder && selectedFolder !== 'none') {
        // Kiểm tra xem folderid có phải là UUID hợp lệ không
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(selectedFolder)) {
          folderIdToSave = selectedFolder;
        } else {
          console.warn('FolderId không phải là UUID hợp lệ:', selectedFolder);
        }
      }
      
      await saveDocument(user.id, documentId);
      setSaved(true);
      setShowDialog(false);
      toast({
        title: "Đã lưu tài liệu",
        description: "Tài liệu đã được lưu vào tài khoản của bạn.",
      });
    } catch (error) {
      console.error("Lỗi khi lưu tài liệu:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu tài liệu vào tài khoản.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={className}
              onClick={handleSaveClick}
              disabled={loading}
            >
              {saved ? <FiCheck className="h-4 w-4" /> : <FiBookmark className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{saved ? "Đã lưu vào tài khoản" : "Lưu vào tài khoản"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Lưu tài liệu</DialogTitle>
            <DialogDescription className="text-gray-400">
              Chọn thư mục để lưu tài liệu này vào tài khoản của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder" className="text-right">
                Thư mục
              </Label>
              <Select
                value={selectedFolder}
                onValueChange={setSelectedFolder}
              >
                <SelectTrigger className="col-span-3 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Chọn thư mục" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="none">Không có thư mục</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              className="bg-transparent hover:bg-gray-800 text-white"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSaveToFolder} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Đang lưu..." : "Lưu tài liệu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
