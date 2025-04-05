# Face-API.js Models

This directory should contain the face-api.js model files.

## Required Files

Download the following files from the face-api.js GitHub repository:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

## Installation Instructions

1. Download the model files from the GitHub repository
2. Place them directly in this directory (public/models/)
3. Do not create subdirectories for the models

## Fallback Behavior

The application is designed to function even if face recognition models fail to load. In such cases:
- Face recognition features will be disabled
- Other app features will continue to work normally
- Users will see a notification in the face recognition card

