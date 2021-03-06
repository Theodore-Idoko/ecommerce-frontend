import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth';

const Signin = () => {

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    redirectToReferer: false,
  })  
  const { email, password, error, redirectToReferer, loading } = values;
  const {user} = isAuthenticated()

  const  handleChange = (email) => (event) => {
    setValues({ ...values, error: false, [email]: event.target.value });
  };

 


  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({...values, error: false, loading: true})
    
    signin({email, password}).then((data) => {
      if (data.error) setValues({ error: data.error, loading: false });
      else {
        // authenticate
        authenticate(data, () => {
          setValues({...values, redirectToReferer: true });
        });
      }
    });
  };

  const signInForm = () => (
    <form>
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

      <button onClick={clickSubmit} className='btn btn-raised btn-primary'>
        Submit
      </button>
    </form>
  );

  const showError= () => (
    <div className='alert alert-danger mt-3' style={{display: error ? '' : 'none'}}>
    {error}
    </div>
  )

  const showLoading= () => (
    loading && (<div className='alert alert-info' >
      Loading...
    </div>)
  )

  const redirectUser = () => {
    if (redirectToReferer) {
      if(user && user.role === 1) {
        return <Redirect to='/admin/dashboard' />
      } else {
        return <Redirect to='/user/dashboard' />
      }
    }
     if(isAuthenticated()){
      return <Redirect to='/' />
     }
  }
  
  return (
    <Layout title='Signin' description='Signin to Node React E-commerce App' className='container col-md-8 offset-md-2'>
    {showLoading()}
    {signInForm()}
    {showError()}
    {redirectUser()}
  </Layout>
  )
}

export default Signin;