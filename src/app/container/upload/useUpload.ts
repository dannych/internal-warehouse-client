import { useCallback, useState } from 'react';

import { useNetwork } from 'src/core/network';
import { useFetch } from 'src/core/network/util/useFetch';

import { RcCustomRequestOptions } from 'antd/lib/upload/interface';

export const useAntdUpload = ({
    path = '/file/upload',
    onFileListChange = (fileList: any[]) => undefined,
}: {
    path?: string;
    onFileListChange?: (fileList: any[]) => void;
}) => {
    const { domain } = useNetwork();

    const [fileList, setFileList] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { loading, get, cache } = useFetch(`${domain}${path}`);

    const onRemove = useCallback(
        (file: any) => {
            const list = fileList.filter((f: any) => file === f);
            setFileList(list);
            onFileListChange(list);
        },
        [fileList, onFileListChange]
    );

    const customRequest = useCallback(
        (options: RcCustomRequestOptions) => {
            (options.file as any).status = 'uploading';
            let newList = [options.file];
            onFileListChange(newList);
            setFileList(newList);

            get().then(async (res) => {
                cache.clear();
                setIsUploading(true);
                fetch(res.uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/pdf',
                    },
                    body: options.file,
                })
                    .then(() => {
                        newList = newList.map((file: any) => {
                            file.url = res.previewUrl;
                            file.trueUrl = `https://primatech-internal-file-staging.s3.amazonaws.com/${res.objectKey}`;
                            file.status = 'done';
                            return file;
                        });

                        onFileListChange(newList);
                        setFileList(newList);

                        options.onSuccess(
                            {
                                ...res,
                                url: `https://primatech-internal-file-staging.s3.amazonaws.com/${res.objectKey}`,
                            },
                            options.file
                        );
                        setIsUploading(false);
                    })
                    .catch((e) => {
                        options.onError(new Error(e));
                    });
            });
        },
        [get, onFileListChange, cache]
    );

    const resetFileList = useCallback(() => {
        setFileList([]);
        onFileListChange([]);
    }, [onFileListChange]);

    return {
        component: {
            customRequest,
            onRemove,
        },
        isLoading: loading || isUploading,
        fileList,
        resetFileList,
    };
};
