import axios from "axios";
import { storage } from "../firebase";
import { FunctionComponent } from "react";

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
  img: any,
  userId: string
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
      async () => {
        await storageRef.getDownloadURL().then(async (url) => {
          let data = new FormData();
          data.append("imgUrl", url);
          data.append("userId", userId);

          await axios
            .patch(`http://localhost:4000/accounts/user/updateProfilePic`, data)
            .then((res) => {
              if (res.status === 201) {
                window.location.reload();
              }
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

export async function uploadPostImage(
  folder: string,
  imgName: string,
  img: any
): Promise<any> {
  try {
    const storageRef = storage.ref(`${folder}/${imgName}`);
    const task = storageRef.put(img);
    return task.on(
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
          return url;
        });
      }
    );
  } catch (err) {
    console.log(`An error ocurred while uploading the temporal image. ${err}`);
  }
}
