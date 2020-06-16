import axios from "axios";
import { storage } from "../firebase";

/**
 * Upload the selected profile image to the firebase storage
 * whose raw and name are passed as parameter.
 *
 * @param folder Destination folder.
 * @param imgName Name of the image to upload.
 * @param img Image to upload.
 * @param userId User id.
 */
export async function uploadProfileImage(
  folder: string,
  imgName: string,
  img: Blob,
  userId: string,
  callback?: any
): Promise<any> {
  try {
    const storageRef = await storage.ref(`${folder}/${imgName}`);
    const task = storageRef.put(img);
    task.on(
      "state_changed",
      (snapshot) => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (err) => {
        console.log(err.message);
      },
      () => {
        storageRef.getDownloadURL().then(async (url) => {
          let newUrlPic = new FormData();
          newUrlPic.append("profile_picture", url);

          await axios
            .put(`http://localhost:4000/accounts/user/${userId}`, newUrlPic)
            .then(async (res) => {
              await callback();
              await window.location.reload();
            })
            .catch((err1) =>
              console.log(
                `An error ocurred while updating the image... ${err1}`
              )
            );
        });
      }
    );
  } catch (err) {
    console.log(`An error ocurred while uploading the image. ${err}`);
  }
}

/**
 * Upload the selected post image to the firebase storage
 * whose raw and name are passed as parameter.
 *
 * @param folder Destination folder --> <posts>
 * @param imgName Name of the post image.
 * @param img Image to upload.
 * @param callback Callback to be executed after uploading the image.
 */
export async function uploadPostImage(
  folder: string,
  imgName: string,
  img: any,
  callback: any
): Promise<any> {
  try {
    const storageRef = storage.ref(`${folder}/${imgName}`);
    const task = storageRef.put(img);
    task.on(
      "state_changed",
      (snapshot) => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (err) => {
        console.log(err.message);
      },
      () => {
        storageRef.getDownloadURL().then((url) => {
          callback(url);
        });
      }
    );
  } catch (err) {
    console.log(`An error ocurred while uploading the temporal image. ${err}`);
  }
}
