import { Suspense } from 'react';
import DocumentSearch from '@/components/documents/DocumentSearch';
import DocumentGrid from '@/components/documents/DocumentGrid';
import DocumentUpload from '@/components/documents/DocumentUpload';
import { getPublicDocuments, searchDocuments } from '@/lib/document-service';
import { FiFileText } from 'react-icons/fi';

interface DocumentsPageProps {
    searchParams: { q?: string };
}

async function DocumentResults({ searchQuery }: { searchQuery?: string }) {
    try {
        let documents = [];

        if (searchQuery) {
            documents = await searchDocuments(searchQuery);
        } else {
            documents = await getPublicDocuments();
        }

        return (
            <DocumentGrid
                documents={documents}
                emptyStateMessage={searchQuery
                    ? `Không tìm thấy kết quả nào cho "${searchQuery}"`
                    : "Chưa có tài liệu nào được tải lên"
                }
            />
        );
    } catch (error) {
        console.error('Lỗi khi tải danh sách tài liệu:', error);
        return (
            <div className="text-center p-8 text-red-500">
                Đã xảy ra lỗi khi tải danh sách tài liệu. Vui lòng thử lại sau.
            </div>
        );
    }
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
    // Sử dụng await cho searchParams trong Next.js 14
    const params = await Promise.resolve(searchParams);
    const searchQuery = params?.q || '';

    return (
        <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Kho tài liệu
                            </h1>
                            <p className="text-white/70">
                                Khám phá và tải xuống các tài liệu chất lượng cao
                            </p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <DocumentSearch className="flex-1 md:w-80" />
                            <DocumentUpload />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/60">
                        <FiFileText className="h-4 w-4" />
                        <span>
                            {searchQuery
                                ? `Kết quả tìm kiếm cho "${searchQuery}"`
                                : "Tất cả tài liệu công khai"
                            }
                        </span>
                    </div>

                    <Suspense fallback={<DocumentGrid documents={[]} isLoading={true} />}>
                        <DocumentResults searchQuery={searchQuery} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
} 