import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import request from 'service/fetch';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/pages/_app';
import { useRouter } from 'next/router';

import styles from './index.module.scss';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: NextPage = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tagIds, setTagIds] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const { push } = useRouter();
  const store = useStore();
  const { id: userId } = store.user.userInfo;

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data?.allTags || []);
      }
    });
  }, []);

  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题');
    } else {
      request
        .post('/api/article/publish', {
          title,
          content,
          tagIds,
        })
        .then((res: any) => {
          if (res?.code === 0) {
            message.success('发布成功');
            // TODO: 跳转
            userId ? push(`/user/${userId}`) : push(`/`);
          } else {
            message.error(res?.msg || '发布失败');
          }
        });
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e?.target?.value);
  };

  const handleInputChange = (content?: string) => {
    setContent(content!);
  };

  const handleSelectTag = (value: []) => {
    setTagIds(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {allTags?.map((tag: any) => (
            <Select.Option key={tag?.id} value={tag?.id}>
              {tag?.title}
            </Select.Option>
          ))}
        </Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor value={content} onChange={handleInputChange} height={1080} />
    </div>
  );
};

NewEditor.layout = null;

export default observer(NewEditor);

// value: string: The Markdown value.
// onChange?: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: ContextStore): Event handler for the onChange event.
// onHeightChange?: (value?: number, oldValue?: number, state?: ContextStore): editor height change listener.
// commands?: ICommand[]: An array of ICommand, which, each one, contain a commands property. If no commands are specified, the default will be used. Commands are explained in more details below.
// commandsFilter?: (command: ICommand, isExtra: boolean) => false | ICommand: Filter or modify your commands.
// extraCommands?: ICommand[]: Displayed on the right side of the toolbar.
// autoFocus?: true: Can be used to make Markdown Editor focus itself on initialization.
// previewOptions?: ReactMarkdown.ReactMarkdownProps: This is reset @uiw/react-markdown-preview settings.
// textareaProps?: TextareaHTMLAttributes: Set the textarea related props.
// renderTextarea?: (props, opts) => JSX.Element;: Use div to replace TextArea or re-render TextArea. #193
// height?: number=200: The height of the editor.
// visibleDragbar?: boolean=true: Show drag and drop tool. Set the height of the editor.
// highlightEnable?: boolean=true: Disable editing area code highlighting. The value is false, which increases the editing speed.
// fullscreen?: boolean=false: Show markdown preview.
// overflow?: boolean=true: Disable fullscreen setting body styles
// preview?: 'live' | 'edit' | 'preview': Default value live, Show markdown preview.
// maxHeight?: number=1200: Maximum drag height. The visibleDragbar=true value is valid.
// minHeights?: number=100: Minimum drag height. The visibleDragbar=true value is valid.
// tabSize?: number=2: The number of characters to insert when pressing tab key. Default 2 spaces.
// defaultTabEnable?: boolean=false: If false, the tab key inserts a tab character into the textarea. If true, the tab key executes default behavior e.g. focus shifts to next element.
// hideToolbar?: boolean=false: Option to hide the tool bar.
// enableScroll?: boolean=true: Whether to enable scrolling.
