const api_key = process.env.REACT_APP_GOOGLE_API_KEY;
const URL = `https://maps.googleapis.com/maps/api/js?key=${api_key}&libraries=places`;
var script = document.createElement("script");
script.src = URL;

export default script;
