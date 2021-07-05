import React, {useState, useEffect} from 'react';
import { createProduct, getCategories } from './apiAdmin';
import { isAuthenticated } from '../auth';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';


const AddProduct = () => {

    
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity : '',
    fileSize: 0,
    categories : [],
    category: '',
    photo: '',
    shipping: '',
    loading: false,
    redirectToDashboard: false,
    error: '',
    createdProduct: '',
    FormData:'',
  })  

  // load categories and set form data
  const init = () => {
    getCategories().then(data => {
      if(data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, categories: data, formData: new FormData()})
      }
    })
  }
  
  useEffect(() => {
    init()
  }, [])

  const { name, description, quantity, price, fileSize, error, redirectToDashboard, loading, createdProduct, category, categories, shipping, formData } = values;

  const isValid = () => {
    
    if (fileSize > 100000) {
      setValues({
        error: 'File size should be less than 1mb',
        loading: false,
      });
      return false;
    }
    if (name.length === 0 || description.length === 0 || quantity.length === 0 || price.length === 0) {
      setValues({ error: 'All fields are required', loading: false });
      return false;
    }

    return true;
  };

  const handleChange = (name) => (event) => {
    setValues({ error: '' });
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    const fileSize = name === 'photo' ? event.target.files[0].size : 0;
    formData.set(name, value);
    setValues({ ...values, [name]: value, fileSize });
  };

  const {user} = isAuthenticated();

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error:'', loading: true });
    if (isValid()) {
      const userID = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      createProduct(userID, token, formData).then((data) => {
        if (data.error) setValues({ ...values, error: data.error });
        else {
          console.log(data.name)
          setValues({...values,
            loading: false,
            name: '',
            description: '',
            photo: '',
            price: '',
            quantity:'',
            redirectToDashboard : true,
            createdProduct: data.name
          })
        }
      });
    }
  };

 const newPostForm = () => (
    <form className='mb-3' onSubmit={clickSubmit}>
      <div className='form-group'>
        <h4>Post Photo</h4>
        <label className='btn btn-secondary'>
        <input
          onChange={handleChange('photo')}
          type='file'
          accept='image/*'
          className='form-control'
          name='photo'
          
        />
        </label>
      </div>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          onChange={handleChange('name')}
          type='text'
          className='form-control'
          value={name}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Description</label>
        <textarea
          onChange={handleChange('description')}
          className='form-control'
          value={description}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Price</label>
        <input
          onChange={handleChange('price')}
          type='number'
          className='form-control'
          value={price}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select
          onChange={handleChange('category')}
          className='form-control'
        >
          <option> Please select </option>
          {categories && categories.map((c, i) => (
            <option key={i} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label className='text-muted'>Quantity</label>
        <input
          onChange={handleChange('quantity')}
          type='number'
          className='form-control'
          value={quantity}
        />
      </div>

      <div className='form-group'>
        <label className='text-muted'>Shipping</label>
        <select
          onChange={handleChange('shipping')}
          className='form-control'
        > 
          <option> Please select </option>
          <option value='0'>No</option>
          <option value='1'>Yes</option>
        </select>
      </div>

      {error && <div className='alert alert-danger'>{error}</div>}

      <button  className='btn btn-raised btn-primary'>
        Create Product
      </button>
    </form>
  );

  
    
    const showSuccess = () => (
      <div className='alert alert-info' style= {{display: createdProduct ? '' : 'none'}}>
        <h2>{`${createdProduct}`} is created! </h2>
      </div>
    )
    
    return (
      <Layout title='Add a new Product' description={`G'day ${user.name}, ready to add a new product?`} className='container col-md-8 offset-md-2'>
        <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {loading ? (
          <div className='alert alert-success'>
            <h2>Loading....</h2>
          </div>
        ) : (
          ''
        )} 
        {createdProduct ? (
          <div className='alert alert-info'>
          <h2>{`${createdProduct}`} is created! </h2>
        </div>
        ) : ''}
        {showSuccess()}
        {newPostForm()}
          </div>
        </div>
        
      </Layout>
      
      
    );
  }


export default AddProduct;
