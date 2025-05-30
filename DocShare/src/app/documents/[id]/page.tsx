import { notFound } from 'next/navigation';
import DocumentViewer from '@/components/documents/DocumentViewer';
import { getDocumentById } from '@/lib/document-service';
import { Metadata } from 'next';

interface DocumentPageProps {
    params: {
        id: string;
    };
}

// Cấu hình metadata động dựa trên tài liệu
export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
    try {
        // Đảm bảo params đã được resolved trước khi sử dụng
        const resolvedParams = await Promise.resolve(params);
        const document = await getDocumentById(resolvedParams.id);

        if (!document) {
            return {
                title: 'Không tìm thấy tài liệu',
                description: 'Tài liệu này không tồn tại hoặc đã bị xóa',
            };
        }

        return {
            title: document.title,
            description: document.description || `Xem tài liệu ${document.title}`,
        };
    } catch (error) {
        console.error('Lỗi khi tải metadata tài liệu:', error);
        return {
            title: 'Lỗi khi tải tài liệu',
            description: 'Đã xảy ra lỗi khi tải thông tin tài liệu',
        };
    }
}

export default async function DocumentPage({ params }: DocumentPageProps) {
    try {
        // Đảm bảo params đã được resolved trước khi sử dụng
        const resolvedParams = await Promise.resolve(params);
        const document = await getDocumentById(resolvedParams.id);

        if (!document) {
            notFound();
        }

        return (
            <div className="mt-12 h-screen text-white flex flex-col">
                {/* Header space - chiếm 64px */}
                <div className="h-16"></div>

                {/* Content space - lấp đầy phần còn lại */}
                <div className="flex-1 px-0 sm:px-4 md:px-6 pb-6">
                    <DocumentViewer document={document} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Lỗi khi tải tài liệu:', error);
        return (
            <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4 text-red-500">Đã xảy ra lỗi</h1>
                    <p className="text-white/70 mb-8">
                        Không thể tải thông tin tài liệu. Vui lòng thử lại sau.
                    </p>
                </div>
            </div>
        );
    }
} 