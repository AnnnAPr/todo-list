import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Logon() {

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');
    try {
      const result = await login(email, password);
        if (result?.success) {
          setAuthError('');
          setEmail('');
          setPassword('');
        } else if (result?.error) {
          setAuthError(result.error);
        }
    } catch (error) {
        setAuthError(`Error: ${error.name} | ${error.message}`);
    } finally {
        setIsLoggingOn(false);
    }
  }

  return (
    <>
      {authError && <p>{authError}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit" disabled={isLoggingOn}>{isLoggingOn ? 'Logging in...' : 'Log On'}</button>
      </form>
    </>
  )
}

export default Logon