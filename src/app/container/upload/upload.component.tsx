import React, { useCallback, useState } from 'react';

import { Upload } from 'antd';

import { useNetwork } from 'src/core/network';

const UploadComponent: React.FC<{ onChange?: (info: any) => void; fileList?: any[] }> = ({
    children,
    onChange,
    ...props
}) => {
    const { domain, token } = useNetwork();
    const [fileList, setFileList] = useState<
        Array<{ url: string; name: string; uid: string; size: number; type: string }>
    >(props?.fileList || []);
    const onChangeCb = useCallback(
        (info) => {
            let list = info.fileList.map((file: any) => {
                if (file.response) {
                    file.url = file.response.previewUrl;
                }
                return file;
            });
            onChange && onChange({ ...info, fileList: list });

            setFileList(list);
        },
        [onChange]
    );
    return (
        <Upload
            {...props}
            action={`${domain}/file/upload`}
            fileList={fileList}
            headers={{
                Authorization: `Bearer ${token}`,
            }}
            onChange={onChangeCb}
        >
            {children}
        </Upload>
    );
};

export default UploadComponent;
