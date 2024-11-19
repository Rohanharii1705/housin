import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/UploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import './NewPostPage.css';

function NewPostPage() {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: description,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate(`/${res.data.id}`);
    } catch (err) {
      console.log(err);
      setError("An error occurred while submitting the post");
    }
  };

  return (
    <div className="newPostPage">
      <div className="newPostFormContainer">
        <h1 className="newPostTitle">Add New Post</h1>
        <form onSubmit={handleSubmit} className="newPostForm">
          <div className="formGroup">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" required />
          </div>
          <div className="formGroup">
            <label htmlFor="price">Price</label>
            <input id="price" name="price" type="number" required />
          </div>
          <div className="formGroup">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" type="text" required />
          </div>
          <div className="formGroup">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="city">City</label>
            <input id="city" name="city" type="text" required />
          </div>
          <div className="formGroup">
            <label htmlFor="bedroom">Bedroom Number</label>
            <input id="bedroom" name="bedroom" type="number" min={1} required />
          </div>
          <div className="formGroup">
            <label htmlFor="bathroom">Bathroom Number</label>
            <input id="bathroom" name="bathroom" type="number" min={1} required />
          </div>
          <div className="formGroup">
            <label htmlFor="latitude">Latitude</label>
            <input id="latitude" name="latitude" type="text" />
          </div>
          <div className="formGroup">
            <label htmlFor="longitude">Longitude</label>
            <input id="longitude" name="longitude" type="text" />
          </div>
          <div className="formGroup">
            <label htmlFor="type">Type</label>
            <select name="type" defaultValue="rent">
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="property">Property</label>
            <select name="property" required>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="utilities">Utilities Policy</label>
            <select name="utilities">
              <option value="owner">Owner is responsible</option>
              <option value="tenant">Tenant is responsible</option>
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="pet">Pet Policy</label>
            <select name="pet">
              <option value="allowed">Allowed</option>
              <option value="not-allowed">Not Allowed</option>
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="income">Income Policy</label>
            <input id="income" name="income" type="text" placeholder="Income Policy" />
          </div>
          <div className="formGroup">
            <label htmlFor="size">Total Size (sqft)</label>
            <input id="size" name="size" type="number" min={0} />
          </div>
          <div className="formGroup">
            <label htmlFor="school">School</label>
            <input id="school" name="school" type="number" min={0} />
          </div>
          <div className="formGroup">
            <label htmlFor="bus">Bus</label>
            <input id="bus" name="bus" type="number" min={0} />
          </div>
          <div className="formGroup">
            <label htmlFor="restaurant">Restaurant</label>
            <input id="restaurant" name="restaurant" type="number" min={0} />
          </div>
          <button className="submitButton">Add</button>
          {error && <span className="errorMessage">{error}</span>}
        </form>
      </div>
      <div className="uploadContainer">
        <h2>Upload Images</h2>
        <div className="imagePreview">
          {images.map((image, index) => (
            <img src={image} key={index} alt="Property" className="previewImage" />
          ))}
        </div>
        <UploadWidget
          uwConfig={{
            cloudName: "dgld4ruon",
            uploadPreset: "estate",
            multiple: true,
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
