// File service mới sử dụng dữ liệu mẫu thay vì Supabase
import { Document, Bookmark, DocumentShare } from '@/types';
import {
  mockDocuments,
  getPublicDocuments,
  getDocumentById,
  getUserDocuments,
  searchDocuments,
  getUserBookmarks
} from './mock-data';

// Re-export các hàm từ mock-data
export {
  getPublicDocuments,
  getDocumentById,
  getUserDocuments,
  searchDocuments,
  getUserBookmarks
};

// Tạo tài liệu mới (giả lập)
export const createDocument = async (document: Omit<Document, 'id' | 'createdat' | 'updatedat'>): Promise<Document> => {
  console.log('Giả lập tạo tài liệu mới:', document);
  
  const newDocument: Document = {
    ...document,
    id: `mock-${Date.now()}`,
    createdat: new Date(),
    updatedat: new Date(),
  };
  
  return newDocument;
};

// Cập nhật tài liệu (giả lập)
export const updateDocument = async (id: string, document: Partial<Document>): Promise<Document> => {
  console.log('Giả lập cập nhật tài liệu:', id, document);
  
  const existingDocument = await getDocumentById(id);
  if (!existingDocument) {
    throw new Error('Không tìm thấy tài liệu');
  }
  
  return {
    ...existingDocument,
    ...document,
    updatedat: new Date(),
  };
};

// Xóa tài liệu (giả lập)
export const deleteDocument = async (id: string): Promise<void> => {
  console.log('Giả lập xóa tài liệu:', id);
  return;
};

// Upload file (giả lập)
export const uploadFile = async (file: File, path: string): Promise<string> => {
  console.log('Giả lập upload file:', file.name, path);
  return `https://example.com/mock-files/${file.name}`;
};

// Đánh dấu tài liệu yêu thích (giả lập)
export const bookmarkDocument = async (userId: string, documentId: string): Promise<Bookmark> => {
  console.log('Giả lập đánh dấu tài liệu yêu thích:', userId, documentId);
  
  const bookmark: Bookmark = {
    id: `mock-${Date.now()}`,
    userid: userId,
    documentid: documentId,
    createdat: new Date(),
  };
  
  return bookmark;
};

// Xóa đánh dấu tài liệu yêu thích (giả lập)
export const removeBookmark = async (userId: string, documentId: string): Promise<void> => {
  console.log('Giả lập xóa đánh dấu tài liệu yêu thích:', userId, documentId);
  return;
};

// Ghi lại lượt xem tài liệu (giả lập)
export const recordDocumentView = async (userId: string, documentId: string): Promise<void> => {
  console.log('Giả lập ghi lại lượt xem tài liệu:', userId, documentId);
  return;
};

// Chia sẻ tài liệu (giả lập)
export const shareDocument = async (share: Omit<DocumentShare, 'id' | 'createdat'>): Promise<DocumentShare> => {
  console.log('Giả lập chia sẻ tài liệu:', share);
  
  const newShare: DocumentShare = {
    ...share,
    id: `mock-${Date.now()}`,
    createdat: new Date(),
  };
  
  return newShare;
};

// Lấy danh sách tài liệu được chia sẻ với người dùng (giả lập)
export const getSharedDocuments = async (userId: string): Promise<Document[]> => {
  console.log('Giả lập lấy danh sách tài liệu được chia sẻ:', userId);
  // Trả về một số tài liệu mẫu
  return mockDocuments.slice(0, 2);
};
