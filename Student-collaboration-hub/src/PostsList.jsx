import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "./context/AuthContext";
import { DarkModeContext } from "./theme";

function getFileIcon(type) {
  if (type === "image") return "🖼️";
  if (type === "video") return "🎬";
  if (type === "application/pdf") return "📄";
  if (type && type.includes("word")) return "📄";
  return "📎";
}

function getFileType(mimetype) {
  if (!mimetype) return null;
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("word")) return "doc";
  return "file";
}

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth ? useAuth() : { user: null };
  const [commentInputs, setCommentInputs] = useState({});
  const [liking, setLiking] = useState({});
  const [commenting, setCommenting] = useState({});
  const [deleting, setDeleting] = useState({});
  const { theme } = useContext(DarkModeContext);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : data.posts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshPosts = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : data.posts || []);
      })
      .finally(() => setLoading(false));
  };

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('link', link);
    files.forEach(f => formData.append('files', f));
    await fetch(`${BACKEND_URL}/posts`, {
      method: "POST",
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData
    });
    setContent("");
    setFiles([]);
    setLink("");
    setUploading(false);
    setLoading(true);
    fetch(`${BACKEND_URL}/api/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : data.posts || []);
      })
      .finally(() => setLoading(false));
  };

  const handleLike = async (postId) => {
    console.log("Liking post", postId);
    setLiking(l => ({ ...l, [postId]: true }));
    const token = localStorage.getItem('token');
    await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: { 'Authorization': `Bearer ${token}` },
    });
    refreshPosts();
    setLiking(l => ({ ...l, [postId]: false }));
  };

  const handleSave = async (postId) => {
    setSaving(s => ({ ...s, [postId]: true }));
    await fetch(`${BACKEND_URL}/posts/${postId}/save`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?._id })
    });
    fetch("https://sch-backend-zmdn.onrender.com/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : data.posts || []);
      });
    setSaving(s => ({ ...s, [postId]: false }));
  };

  const handleComment = async (postId) => {
    setCommenting(c => ({ ...c, [postId]: true }));
    const text = commentInputs[postId];
    if (!text) return;
    const token = localStorage.getItem('token');
    await fetch(`${BACKEND_URL}/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text })
    });
    setCommentInputs(inputs => ({ ...inputs, [postId]: "" }));
    refreshPosts();
    setCommenting(c => ({ ...c, [postId]: false }));
  };

  const handleDelete = async (postId) => {
    setDeleting(d => ({ ...d, [postId]: true }));
    const token = localStorage.getItem('token');
    await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    refreshPosts();
    setDeleting(d => ({ ...d, [postId]: false }));
  };

  // Responsive grid styles
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px"
  };

  // Post creation form
  const postForm = (
    <form onSubmit={handleCreatePost} style={{ marginBottom: 32, background: theme.cardBackground, color: theme.text, padding: 20, borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <h3 style={{ margin: 0, color: theme.primary }}>Create a Post</h3>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        style={{ width: '100%', margin: '12px 0', padding: 10, borderRadius: 6, border: `1px solid ${theme.primary}`, color: theme.text, background: theme.background }}
      />
      <input type="file" multiple onChange={handleFilesChange} style={{ margin: '8px 0' }} />
      <input
        type="url"
        placeholder="Add a link (optional)"
        value={link}
        onChange={e => setLink(e.target.value)}
        style={{ width: '100%', margin: '8px 0', padding: 8, borderRadius: 4, border: `1px solid ${theme.primary}`, color: theme.text, background: theme.background }}
      />
      {/* File previews */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '8px 0' }}>
          {files.map((file, idx) => {
            const type = getFileType(file.type);
            return (
              <div key={idx} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, padding: 6, minWidth: 80, textAlign: 'center', background: theme.background }}>
                {type === 'image' ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: 60, maxHeight: 60, borderRadius: 4 }} />
                ) : type === 'video' ? (
                  <span style={{ fontSize: 32 }}>🎬</span>
                ) : type === 'pdf' ? (
                  <span style={{ fontSize: 32 }}>📄</span>
                ) : type === 'doc' ? (
                  <span style={{ fontSize: 32 }}>📄</span>
                ) : (
                  <span style={{ fontSize: 32 }}>📎</span>
                )}
                <div style={{ fontSize: 12, marginTop: 2 }}>{file.name}</div>
              </div>
            );
          })}
        </div>
      )}
      <button type="submit" disabled={uploading} style={{ background: theme.primary, color: 'white', border: 'none', padding: '10px 24px', borderRadius: 6, marginTop: 8, fontWeight: 600 }}>
        {uploading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );

  // Post card
  function PostCard({ post }) {
    const userInitial = post.user_name ? post.user_name[0]?.toUpperCase() : "U";
    const likeCount = post.likes ? post.likes.length : 0;
    const userLiked = post.likes && user ? post.likes.includes(String(user._id)) : false;
    // Determine file URL and type for expand
    const fileUrl = post.file_url || (post.files && post.files[0] && post.files[0].url);
    const fileType = post.file_type || (post.files && post.files[0] && post.files[0].type);
    return (
      <div style={{ background: theme.cardBackground, color: theme.text, borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 20, display: 'flex', flexDirection: 'column', minHeight: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: theme.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, marginRight: 12 }}>{userInitial}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{post.user_name || "Unknown"}</div>
            <div style={{ fontSize: 13, color: theme.secondaryText }}>{post.user_email ? post.user_email : ''} {post.user_department ? `• ${post.user_department}` : ''} • {new Date(post.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div style={{ margin: '8px 0', fontSize: 15 }}>{post.content}</div>
        {/* Link preview */}
        {post.link && (
          <a href={post.link} target="_blank" rel="noopener noreferrer" style={{ color: theme.primary, textDecoration: 'underline', wordBreak: 'break-all', marginBottom: 8, display: 'block' }}>{post.link}</a>
        )}
        {/* File previews */}
        {fileUrl && (
          <div style={{ margin: '8px 0' }}>
            {fileType && fileType.startsWith('image') ? (
              <img src={fileUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
            ) : fileType === 'pdf' ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
            ) : fileType && fileType.startsWith('video') ? (
              <video src={fileUrl} controls style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8 }} />
            ) : (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">Open File</a>
            )}
          </div>
        )}
        {/* Expand button */}
        {fileUrl && (
          <button
            onClick={() => window.open(fileUrl, '_blank')}
            style={{ marginBottom: 8, background: theme.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}
          >
            Expand
          </button>
        )}
        {/* Delete button (only for post owner) */}
        {user && String(post.user_id) === String(user._id) && (
          <button
            onClick={() => handleDelete(post._id)}
            disabled={deleting[post._id]}
            style={{ marginBottom: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: deleting[post._id] ? 'not-allowed' : 'pointer', opacity: deleting[post._id] ? 0.7 : 1, transition: 'opacity 0.2s' }}
          >
            {deleting[post._id] ? 'Deleting...' : 'Delete'}
          </button>
        )}
        {/* Like and comment actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0' }}>
          <button
            onClick={() => { console.log("Button clicked", post._id); handleLike(post._id); }}
            style={{
              background: userLiked ? theme.primary : theme.background,
              color: userLiked ? '#fff' : theme.primary,
              border: `1px solid ${theme.primary}`,
              borderRadius: 6,
              padding: '6px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginRight: 8
            }}
          >
            {userLiked ? '♥' : '♡'} Like ({likeCount})
          </button>
        </div>
        {/* Comments section */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Comments</div>
          {post.comments && post.comments.length > 0 ? (
            <div style={{ maxHeight: 120, overflowY: 'auto', marginBottom: 8 }}>
              {post.comments.map((c, idx) => (
                <div key={idx} style={{ marginBottom: 6, padding: 6, background: theme.background, borderRadius: 4, border: `1px solid ${theme.border}` }}>
                  <span style={{ fontWeight: 500 }}>{c.user_id}</span>: {c.text}
                  <span style={{ fontSize: 11, color: theme.secondaryText, marginLeft: 8 }}>{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: theme.secondaryText, fontSize: 13 }}>No comments yet.</div>
          )}
          {user && (
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post._id] || ''}
                onChange={e => setCommentInputs(inputs => ({ ...inputs, [post._id]: e.target.value }))}
                style={{ flex: 1, padding: 6, borderRadius: 4, border: `1px solid ${theme.primary}` }}
                disabled={commenting[post._id]}
              />
              <button
                onClick={() => handleComment(post._id)}
                disabled={commenting[post._id] || !(commentInputs[post._id] && commentInputs[post._id].trim())}
                style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}
              >
                {commenting[post._id] ? 'Posting...' : 'Post'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", background: theme.background, color: theme.text, padding: 24, borderRadius: 12 }}>
      {user && postForm}
      <h2 style={{ color: theme.primary, marginBottom: 24 }}>Posts</h2>
      {loading ? <div>Loading...</div> : posts.length === 0 ? <div>No posts found.</div> : (
        <div style={gridStyle}>
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
} 