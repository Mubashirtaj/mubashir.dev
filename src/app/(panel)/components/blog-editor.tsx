"use client";

import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/js/plugins.pkgd.min.js";

export default function BlogEditor({
  model,
  setModel,
}: {
  model: string;
  setModel: (model: string) => void;
}) {
  const uploadToAWS = async (file: File) => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    const { uploadUrl, key } = await res.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Blog Editor</h2>
      <FroalaEditor
        tag="textarea"
        model={model}
        onModelChange={(newModel: string) => setModel(newModel)}
        config={{
          placeholderText: "Write your blog content here...",
          charCounterCount: true,
          toolbarButtons: [
            "bold",
            "italic",
            "underline",
            "strikeThrough",
            "subscript",
            "superscript",
            "fontFamily",
            "fontSize",
            "color",
            "paragraphFormat",
            "paragraphStyle",
            "align",
            "formatOL",
            "formatUL",
            "outdent",
            "indent",
            "quote",
            "insertLink",
            "insertImage",
            "insertVideo",
            "insertFile",
            "insertTable",
            "emoticons",
            "specialCharacters",
            "insertHR",
            "undo",
            "redo",
            "clearFormatting",
            "selectAll",
            "html",
            "fullscreen",
            "print",
            "help",
          ],
          events: {
            "image.beforeUpload": async function (files: File[]) {
              if (!files.length) return false;
              const publicUrl = await uploadToAWS(files[0]);
              (this as any).image.insert(
                publicUrl,
                false,
                null,
                (this as any).image.get(),
                null,
              );
              return false;
            },
            "video.beforeUpload": async function (files: File[]) {
              if (!files.length) return false;
              const publicUrl = await uploadToAWS(files[0]);
              (this as any).video.insert(
                publicUrl,
                null,
                null,
                (this as any).video.get(),
                null,
              );
              return false;
            },
            "file.beforeUpload": async function (files: File[]) {
              if (!files.length) return false;
              const publicUrl = await uploadToAWS(files[0]);
              (this as any).file.insert(
                publicUrl,
                files[0].name,
                null,
                (this as any).file.get(),
                null,
              );
              return false;
            },
          },
        }}
      />
    </div>
  );
}
