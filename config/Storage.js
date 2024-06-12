import { Storage } from '@google-cloud/storage';

// Inisialisasi Google Cloud Storage
const storage = new Storage();

// Nama bucket untuk penyimpanan meat dan profile picture
const meatBucketName = 'meatopia-meats';
const profilePictureBucketName = 'profile-picture-meatopia';

// Referensi bucket
const meatBucket = storage.bucket(meatBucketName);
const profilePictureBucket = storage.bucket(profilePictureBucketName);

export { meatBucket, profilePictureBucket };

