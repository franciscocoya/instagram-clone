import axios from "axios";
import { storage } from "../firebase";

export async function uploadPostImage(
  imgName: string,
  img: Blob,
  userId: string
): Promise<any> {
  try {
    const storageRef = storage.ref(`profiles/${imgName}`);
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

export async function uploadProfileImage(): Promise<any> {}
