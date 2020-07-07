const postCtrl = {};

const Post = require("../models/Post/Post");
const PostLike = require("../models/Like/PostLike");
const { hash } = require("bcryptjs");

postCtrl.addPost = async (req, res) => {
  try {
    const {
      thumbnail,
      description,
      lat,
      lng,
      tags,
      name,
      countryCode,
      imgFilter,
      flag,
      user_id,
    } = req.body;

    let isFilter =
      imgFilter !== undefined && imgFilter !== null && imgFilter !== "";

    const newPost = isFilter
      ? await new Post({
          thumbnail,
          description,
          user_id,
          place: {
            name,
            countryCode,
            flag,
            location: {
              lat,
              lng,
            },
          },
          tags,
        })
      : await new Post({
          thumbnail,
          description,
          imgFilter,
          user_id,
          place: {
            name,
            countryCode,
            flag,
            location: {
              lat,
              lng,
            },
          },
          tags,
        });

    await newPost.save((err, postAdded) => {
      if (err) {
        res.status(500).json({
          msg: `Error al añadir el post: ${err}`,
        });
      }

      res.status(201).json({
        msg: "Post añadido correctamente",
        post: postAdded,
      });
    });
  } catch (err) {
    console.log(`Se ha producido un error al subir el post en backend. ${err}`);
  }
};

postCtrl.getPost = async (req, res) => {
  const { postId } = req.params;

  await Post.findOne({ _id: postId }, (err, postRet) => {
    if (err) {
      res.status(500).json({
        msg: `Error al obtener el post: ${err}`,
      });
    }

    if (!postRet) {
      res.status(404).json({
        msg: "El post solicitado no existe",
      });
    }
    res.status(201).json({
      postRet,
      msg: "Post listado correctamente",
    });
  });
};

postCtrl.updatePost = async (req, res) => {
  const postId = req.params.postId;
  const updatePost = req.body;

  await Post.findByIdAndUpdate(postId, updatePost, (err, postUpdated) => {
    if (err) {
      res.status(500).json({
        msg: `Error al actualizar el post: ${err}`,
      });
    }

    res.status(201).json({
      postUpdated,
      msg: "Post actualizado correctamente",
    });
  });
};

postCtrl.deletePost = async (req, res) => {
  const postId = req.params.postId;

  await Post.findByIdAndDelete(postId, (err, postDeleted) => {
    if (err) {
      res.status(500).json({
        msg: `Error al eliminar el post: ${err}`,
      });
    }

    res.status(201).json({
      msg: "Post eliminado correctamente",
    });
  });
};

postCtrl.listPosts = async (req, res) => {
  await Post.find((err, posts) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los posts: ${err}`,
      });
    }

    if (!posts) {
      res.status(404).json({
        msg: "No hay post publicados",
      });
    }
    res.status(201).json({
      posts,
      msg: "Post listados correctamente",
    });
  }).sort({ created_at: -1 });
};

postCtrl.listPostByUserId = async (req, res) => {
  const { userId } = req.params;
  await Post.find({ user_id: userId }, (err, posts) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los posts del usuario: ${err}`,
      });
    }

    if (!posts) {
      res.status(404).json({
        msg: "No hay post publicados por el usuario: " + userId,
      });
    }
    res.status(201).json({
      posts,
      msg: "Post listados correctamente",
    });
  }).sort({ created_at: -1 });
};

postCtrl.listLastRelatedPostsByUserId = async (req, res) => {
  const { userId } = req.params;
  let result = await Post.find(
    {
      user_id: userId,
    },
    (err, posts) => {
      if (err) {
        res.status(500).json({
          msg: `Error al listar los posts relacionados: ${err}`,
        });
      }

      if (!posts) {
        res.status(404).json({
          msg: "No hay post relacionados por: " + userId,
        });
      }
    }
  )
    .sort({
      created_at: -1,
    })
    .limit(6);

  if (!result) {
    res.status(404).json({
      msg: "No hay post relacionados",
    });
  }
  res.status(201).json({
    posts: result,
    msg: "Post listados correctamente",
  });
};

postCtrl.getAllLocations = async (req, res) => {
  try {
    const allLocations = await Post.find();
    let reduced = allLocations.reduce((acc, post) => {
      return [...acc, post["place"]["name"]];
    }, []);

    let noDupArr = [...new Set(reduced)];

    if (noDupArr.length === 0) {
      res.status(401).json({
        msg: `No hay localizaciones.`,
      });
    }

    res.status(201).json({
      locations: noDupArr,
      msg: `Localizaciones listadas correctamente.`,
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al obtener la localizaciones. ${err}.`
    );
  }
};

postCtrl.listPostsByLocation = async (req, res) => {
  try {
    const { placeName } = req.params;
    await Post.find({ "place.name": placeName }, (err1, posts) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al obtener los posts de la localizacion ${placeName}. ${err1}`,
        });
      }

      if (posts.length === 0) {
        res.status(401).json({
          msg: `No hay posts en la localización <${placeName}>. `,
        });
      }

      res.status(201).json({
        posts,
        msg: "Posts listados correctamente.",
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al obtener los posts de la localización. ${err}`
    );
  }
};

postCtrl.listPostsByHashtag = async (req, res) => {
  try {
    const { hashtagName } = req.params;

    let rgxHashtag = new RegExp(`[#]{1}(\\b(\W*${hashtagName}\W*)\\b)`);
    await Post.find({ description: { $regex: rgxHashtag } }, (err1, result) => {
      if (err1) {
        res.status(500).json({
          msg: `A server-side error ocurred while getting the posts. ${err1}`,
        });
      }

      if (!result) {
        res.status(404).json({
          msg: "There are no posts that include the hashtag in the description",
        });
      }

      res.status(201).json({
        posts: result,
      });
    });
  } catch (err) {
    console.log(`An error ocurred searching the hashtag posts. ${err}`);
  }
};

postCtrl.countPosts = async (req, res) => {
  await Post.find((err, posts) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los posts: ${err}`,
      });
    }

    if (!posts) {
      res.status(404).json({
        msg: "No hay post publicados",
      });
    }
  }).count((err, postCount) => {
    if (err) {
      res.status(500).json({
        msg: `Error al contar los posts: ${err}`,
      });
    }

    res.status(201).json({
      postCount,
    });
  });
};

postCtrl.getLikesByPostId = async (req, res) => {
  const { postId } = req.params;
  await Post.findById(postId, async (err, post) => {
    if (err) {
      res.status(500).json({
        msg: `Error al listar los posts: ${err}`,
      });
    }

    if (!post) {
      res.status(404).json({
        msg: "No hay post publicado",
      });
    }
    const likeId = post.like_id;
    await PostLike.findById(likeId, (err2, like) => {
      if (err2) {
        res.status(500).json({
          msg: `Error al obtener el like: ${err}`,
        });
      }

      if (!like) {
        res.status(404).json({
          msg: "No existe el like",
        });
      }
      if (like !== null) {
        const likeCount = like.count();
        console.log(likeCount);
        res.status(201).json({
          count: likeCount,
        });
      } else {
        console.log("No hay likes");
      }
    });
  });
};

postCtrl.getCoordinatesByLocation = async (req, res) => {
  try {
    const { placeName } = req.params;
    await Post.find({ "place.name": placeName }, (err1, posts) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al obtener los posts. ${err1}`,
        });
      }

      if (posts.length > 0) {
        res.status(201).json({
          coords: posts[0].place.location,
          msg: "Coordenadas obtenidas correctamente.",
        });
      } else {
        res.status(401).json({
          msg: "No hay posts.",
        });
      }
    });
  } catch (err) {
    console.log(`Se ha producido un error al obtener la coordenadas. ${err}`);
  }
};

postCtrl.getFeaturePostByLocation = async (req, res) => {
  try {
    const { placeName } = req.params;
    await Post.findOne({ "place.name": placeName }, (err1, result) => {
      if (err1) {
        res.status(500).json({
          msg: `Error en el servidor al obtener el post. ${err1}`,
        });
      }

      if (!result) {
        res.status(404).json({
          msg: "No hay ningún post destacado.",
        });
      }

      res.status(201).json({
        post: result,
        msg: "Post destacado obtenido correctamente.",
      });
    });
  } catch (err) {
    console.log(
      `Se ha producido un error al obtener el post destacado de la localización. ${err}`
    );
  }
};

module.exports = postCtrl;
