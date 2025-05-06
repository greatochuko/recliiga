const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export async function uploadImage(
  file: File,
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "recliiga");
  formData.append("cloud_name", cloudinaryCloudName);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,

      { method: "POST", body: formData },
    );
    const data = await res.json();
    return { url: data.secure_url, error: null };
  } catch (err) {
    return { url: null, error: err.message };
  }
}
