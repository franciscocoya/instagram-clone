import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import { storage } from "../../firebase";

//Queries
import { uploadPostImage } from "../../queries/image_queries";

//Components
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

import UserNavigation from "../Navigations/UserNavigation";
import Loader from "../Loader/Loader";
import ImageTools from "../UploadPostTools/ImageTools";
import SearchResults from "../Modals/SearchResults";

//Static files
import "../../public/css/Post/uploadPost.css";
import OwlCarrouselDemo from "./OwlCarrousel";
import "../../public/css/partials/cssgram.min.css";
import dragIcon from "../../public/assets/img/drag-icon.png";

function UploadPost({ user }) {
  const history = useHistory();
  const [image, setImage] = useState({
    preview: "",
    width: 0,
    height: 0,
    name: "",
  });

  const [imgRAW, setImgRAW] = useState(null); //Image file
  const [imgURL, setImgURL] = useState("");

  const [description, setDescription] = useState("");
  const [tagCad, setTagCad] = useState([]);
  //Location
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [isAutocomplete, setAutocomplete] = useState(false);
  const [flag, setFlag] = useState({
    url: "",
    name: "",
  });
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  //Image params to change in ImageTools
  const [imgParams, setImgParams] = useState({
    crop: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    rotateDegrees: 0,
    flipHorizontal: false,
    flipVertical: false,
    adjust: false,
    reset: false,
  });
  const [applyParams, setApplyParams] = useState(false);
  const [searchResults, setSearchResults] = useState([]); //Search
  const [showSearchResults, setShowSearchResults] = useState(false); //Show search results

  /**
   * Shows the suggestion of the written location.
   * @param {*} value
   */
  async function handleSelect(value) {
    if (value.length === 0) {
      setAutocomplete(false);
    }
    let countryCode = null;
    const results = await geocodeByAddress(value);
    console.log(results[0]);
    //results[0].address_components[2].short_name
    const addressArr = results[0].address_components;
    console.log(addressArr[0].short_name.length);
    for (let i = 0; i < addressArr.length; i++) {
      if (addressArr[i].short_name.length === 2) {
        countryCode = addressArr[i].short_name;
      }
    }

    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
    setAutocomplete(true);

    if (countryCode !== undefined) {
      await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setFlag({
            url: data.flag,
            name: data.name,
          });
          setCountry(countryCode);
        });
    }
  }

  /**
   * Load the image of the post and set a preview of it.
   * @param {*} e
   */
  function handleChange(e) {
    setImgLoaded(false);
    let imgFile = e.target.files[0];
    createTempImage(imgFile);
    let url = URL.createObjectURL(imgFile);
    let img = new Image(imgFile.width, imgFile.height);
    img.src = url;
    img.onload = (e) => {
      setImage({
        width: img.width,
        height: img.height,
        preview: url,
        raw: imgFile,
        name: imgFile.name,
      });
    };

    setImgLoaded(true);
  }

  /**
   * Upload temporary image preview to firebase
   * @param {*} img Image to get temporal url
   */
  const createTempImage = (img) => {
    setImgRAW(img);
    handleUploadImage("posts", img.name, img);
  };

  function handleDescription(e) {
    setDescription(e.target.value);
  }

  function handleTag(e) {
    setTagCad(e.target.value);
  }

  const handleUploadImage = async (img, folder) => {
    const result = await uploadPostImage(folder, img.name, img);
    setImgURL(result);
  };

  // const uploadToFirebase = async (img, folder) => {
  //   try {
  //     const storageRef = storage.ref(`${folder}/${img.name}`);
  //     const task = storageRef.put(img);
  //     task.on(
  //       "state_changed",
  //       (snapshot) => {
  //         let percentage =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       },
  //       (err) => {
  //         console.log(err.message);
  //       },
  //       () => {
  //         storageRef.getDownloadURL().then((url) => {
  //           setImgURL(url);
  //         });
  //       }
  //     );
  //   } catch (err) {
  //     console.log(
  //       `Se ha producido un error al subir la imagen temporal. ${err}`
  //     );
  //   }
  // };

  // *** UPLOAD POST ***
  /**
   * TODO:
   * @param {*} e
   */
  const uploadPost = async (e) => {
    e.preventDefault();

    try {
      let arrTags = parsearCadena();

      let data = new FormData();

      if (arrTags.length > 0) {
        arrTags.forEach((tag) => {
          data.append("tags", tag);
        });
      }

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      data.append("description", description);
      data.append("name", address); //Lugar
      data.append("lat", coordinates.lat);
      data.append("lng", coordinates.lng);
      data.append("countryCode", country);
      data.append("flag", flag.url);
      data.append("thumbnail", imgURL);
      data.append("user_id", user._id);
      if (
        selectedFilter !== "" &&
        selectedFilter !== undefined &&
        selectedFilter !== null
      ) {
        data.append("imgFilter", selectedFilter);
      }

      await axios
        .post("http://localhost:4000/p/uploadPost", data, config)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err2) =>
          console.log(
            `Se ha producido un error al subir el post al servidor. ${err2} `
          )
        );

      history.push(`/${user.username}`);
    } catch (err) {
      removeTempFromFirebase();
      console.log(`Se ha producido un error al subir el post. ${err}`);
    }
  };

  const parsearCadena = () => {
    if (tagCad !== undefined && tagCad !== null && tagCad.length > 0) {
      const tagsArr = tagCad.split(",");
      const tagsCopy = tagsArr.map((t) => t.trim());
      return tagsCopy;
    } else {
      return [];
    }
  };

  const cancelarPost = () => {
    resetFields();
    removeTempFromFirebase();
    setTimeout(() => {
      history.push(`/${user.username}`);
    }, 200);
  };

  function resetFields() {
    setDescription(null);
    setTagCad("");
    setFlag("");
    setCoordinates(0);
    setCountry("");
  }

  function deleteSelectedFilter(e) {
    setSelectedFilter(null);
  }

  const setFilter = (e) => {
    setSelectedFilter(e.target.childNodes[0].innerHTML);
  };

  function dropHandler(ev) {
    //console.log("File(s) dropped");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          let imgFile = ev.dataTransfer.files[i];
          let url = URL.createObjectURL(imgFile);
          setImage({
            preview: url,
            raw: imgFile,
          });
          setImgLoaded(true);
        }
      }
    } else {
      setImgLoaded(false);
    }

    removeDragData(ev);
  }

  function dragOverHandler(ev) {
    //console.log("File(s) in drop zone");
    setImgLoaded(false);
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  function removeDragData(ev) {
    //console.log("Removing drag data");

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
    setImgLoaded(false);
  }

  const handleStyleSize = (img) => {
    const defaultWidth = 480;
    const defaultHeight = 600;

    let oldWidth = image.width;
    let oldHeight = image.height;

    let marginTop = imgParams.top || 0;
    let marginBottom = imgParams.bottom || 0;
    let marginLeft = imgParams.left || 0;
    let marginRight = imgParams.right || 0;
  };

  /**
   * TODO:
   */
  const crop = () => {
    let img = document.getElementById("img-preview-main");
    const cropper = new Cropper(img, {
      aspectRatio: 1,
      zoomable: true,
      scalable: true,
      crop(event) {
        const canvas = cropper.getCroppedCanvas();

        console.log(event.detail.x);
        console.log(event.detail.y);
        console.log(event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);
      },
    });
  };

  const handleTransforms = (img) => {
    let flipH = imgParams.flipHorizontal;
    let flipV = imgParams.flipVertical;
    let degs = imgParams.rotateDegrees;

    img.css({
      transform: `scaleX(${flipH ? -1 : 1}) scaleY(${
        flipV ? -1 : 1
      }) rotate(${degs}deg)`,
      transformOrigin: "center",
    });
  };

  const handleAdjustImage = (img) => {
    var imgContainer = $(".cont-image-preview");
    const DEFAULT_WIDTH = 480;
    const DEFAULT_HEIGHT = 600;
    imgParams.adjust
      ? img.css({
          width: DEFAULT_WIDTH + "px",
          height: DEFAULT_HEIGHT + "px",
          objectFit: "cover",
        })
      : img.css({
          width: image.width,
          height: image.height,
          objectFit: "contain",
        });
  };

  /**
   * TODO:
   */
  const handleResetImage = () => {};

  /**
   * TODO:  Apply the new adjustment parameters to the image.
   */
  const styleImageParams = () => {
    var img = $(".img-preview");
    crop();
    handleStyleSize(img); //Width & height
    handleTransforms(img);
    handleAdjustImage(img); //Adjust image to default instagram post size
    //handleResetImage(); //Reset image params
  };

  /**
   * TODO:
   */
  const removeTempFromFirebase = () => {
    const storageRef = storage.ref(`posts/${image.name}`);
    var imgRef = storageRef
      .delete()
      .then(() => console.log(`Temp eliminado correctamente`))
      .catch((err) =>
        console.log(
          `Se ha producido un error al eliminar el temp de la imagen. ${err}`
        )
      );
  };

  //Effects
  useEffect(() => {
    styleImageParams();
  }, [
    imgParams.rotateDegrees,
    imgParams.adjust,
    imgParams.crop,
    imgParams.flipHorizontal,
    imgParams.flipVertical,
    image.preview,
  ]);

  return (
    <div className="w-upload-loading">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-upload">
          <UserNavigation
            showPersonalProfile={false}
            user={user}
            resultsArr={setSearchResults}
            showSuggestions={() => setShowSearchResults(true)}
            closeSuggestions={() => setShowSearchResults(false)}
          />
          {showSearchResults && (
            <SearchResults
              suggestions={searchResults}
              user={user}
              close={() => setShowSearchResults(false)}
            />
          )}
          <div className="upload-wrapper w-100">
            <div className="upload-main mp-0">
              {/* Content input upload post */}
              <div
                className="upload-col-1 mp-0"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
              >
                <div className="cont-image-preview">
                  {/* image.preview */}
                  <img
                    src={image.preview}
                    className={`img-preview ${selectedFilter}`}
                    id="img-preview-main"
                  />
                </div>
                {/* TODO: Image tools */}
                <ImageTools setImgParams={setImgParams} />
                <form className="w-upload-input">
                  {/* File input Drag & Drop */}
                  <input
                    type="file"
                    className="img-post-input mp-0"
                    name="img-post"
                    id="file-upload"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                  />
                  {/* {imagePreview} */}

                  {/* Overlay text input */}
                  <label
                    className="overlay-text-img mp-0"
                    htmlFor="file-upload"
                  >
                    <img
                      src={dragIcon}
                      width="70px"
                      className="drag-icon"
                      alt="Icono drag and drop"
                    />
                    <p>Haz click o arrastra una foto aquí</p>
                    <p className="tx-s-gris">
                      El archivo debe ser JPG o PNG. El tamaño recomendado es de
                      480 x 600 píxeles.
                    </p>
                  </label>
                </form>
              </div>
              <div className="upload-col-2 mp-0">
                {/* Cont filters */}
                <div className="carrousel-filtros-img">
                  <div className="cont-title-filtros">
                    <h2>Filtros</h2>
                    {selectedFilter && (
                      <div className="chip-selected-filter">
                        <p className="mp-0">{selectedFilter}</p>
                        <span
                          className="close-chip"
                          title="Quitar filtro seleccionado"
                          onClick={deleteSelectedFilter}
                        >
                          &times;
                        </span>
                      </div>
                    )}
                  </div>
                  {/* OWL Carrousel- Filtros imagen */}
                  <OwlCarrouselDemo
                    image={image.preview}
                    setFilt={setFilter}
                    imgLoaded={imgLoaded}
                  />
                </div>
                {/* Cont Post info */}
                <div className="cont-post-description w-100">
                  <label htmlFor="desc-input">Información</label>
                  <div className="w-100">
                    <textarea
                      className="input-bg-transparent"
                      type="text"
                      id="desc-input"
                      placeholder="Escribe un pie de foto"
                      onChange={handleDescription}
                      value={description}
                    />
                  </div>
                </div>
                {/* Cont location */}
                <div className="cont-post-location w-100">
                  {isAutocomplete && (
                    <div className="mp-0">
                      <img
                        className="country-flag"
                        src={flag.url}
                        alt={flag.name}
                        title={flag.name}
                      />
                    </div>
                  )}

                  <PlacesAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleSelect}
                    className="placesAutoComp"
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div className="w-96">
                        <input
                          className="input-bg-transparent w-100"
                          {...getInputProps({ placeholder: "Localización..." })}
                        />
                        <div>
                          {loading ? <div>cargando...</div> : null}
                          {suggestions.map((suggestion) => {
                            const style = suggestion.active
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                };

                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  style,
                                })}
                              >
                                {suggestion.description}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
                {/* Cont tags */}
                <div className="cont-post-tags w-100">
                  <label htmlFor="tags-input">Tags</label>
                  <textarea
                    type="text"
                    id="tags-input"
                    name="tags"
                    className="input-bg-transparent"
                    placeholder="Escribe los tags separados por una coma"
                    onChange={handleTag}
                    value={tagCad}
                  />
                </div>
                <div className="upload-buttons w-100 mp-0">
                  <div className="wrapper-buttons-up">
                    <button
                      className="bt-publicar"
                      disabled={image.preview ? false : true}
                      onClick={uploadPost}
                    >
                      Publicar
                    </button>
                    <Link
                      to={`/${user.username}`}
                      className="decoration-none link-cancelar"
                    >
                      <button
                        className="bt-cancelar-upload"
                        onClick={cancelarPost}
                      >
                        Cancelar
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons content */}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPost;
