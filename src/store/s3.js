// Taken from the s3 short assignment
import axios from 'axios';
// Same API for contacts slices??
const API = 'https://project-api-financy.onrender.com/api';
// const API = 'http://localhost:9090/api';

async function getSignedRequest(file) {
  const fileName = encodeURIComponent(file.name);
  const token = localStorage.getItem('token');
  // hit our own server to get a signed s3 url
  const response = await axios.get(`${API}/sign-s3?file-name=${fileName}&file-type=${file.type}`, {
    headers: { Authorization: token },
  });
  return response;
}

// upload file directly to S3
// note how we return the passed in url here rather than any return value
// since we already know what the url will be - just not that it has been uploaded
async function uploadFileToS3(signedRequest, file, url) {
  await axios.put(signedRequest, file, { headers: { 'Content-Type': file.type } });
  return url;
}

export default async function uploadImage(file) {
  // returns a promise so you can handle error and completion in your component
  const response = await getSignedRequest(file);
  return uploadFileToS3(response.data.signedRequest, file, response.data.url);
}
