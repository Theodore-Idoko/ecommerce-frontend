import React, {useState} from 'react';
import Layout from '../core/Layout';
import { Link } from 'react-router-dom';
import { signup } from '../auth';


const Signup = () => {

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  })  

  
  const handleChange = (name) => (event) => {
    
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const { name, email, password, error, success } = values;

  
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error: false})
    signup({name, email, password}).then((data) => {
      if (data.error) setValues({...values, error: data.error, success: false });
      else
        setValues({
          ...values,
          error: '',
          name: '',
          email: '',
          password: '',
          success: true,
        });
      });
    
  };


  const signupForm = () => (
  <form>
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
      <label className='text-muted'>Email</label>
      <input
        onChange={handleChange('email')}
        type='email'
        className='form-control'
        value={email}
      />
    </div>
    <div className='form-group'>
      <label className='text-muted'>Password</label>
      <input
        onChange={handleChange('password')}
        type='password'
        className='form-control'
        value={password}
      />
    </div>
    
    <button onClick={clickSubmit}  className='btn btn-raised btn-primary'>
      Submit
    </button>
    
  </form>
);

const showError= () => (
  <div className='alert alert-danger mt-3' style={{display: error ? '' : 'none'}}>
  {error}
  </div>
)

const showSuccess= () => (
  <div className='alert alert-info' style={{display: success ? '' : 'none'}}>
     New acccount is successfully created. Please 
        <Link to='/signin'>SignIn</Link>
  </div>
)

  return (
    <Layout title='Signup' description='Signup to Node React E-commerce App' className='container col-md-8 offset-md-2'>
    {showSuccess()}
    {signupForm()}
    {showError()}
    
  </Layout>
  )
}

export default Signup;