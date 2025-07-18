67a5e4545fd7d944410fe6cd0e8b03a40225a81377fec0cd73a54d431dee15fa02-5c9082a0-dfe5-430b-bf60-1b9bc125b4060002520056b0d100

2025-07-18T15:02:10.6482037Z Current runner version: '2.326.0'
2025-07-18T15:02:10.6507844Z ##[group]Runner Image Provisioner
2025-07-18T15:02:10.6508779Z Hosted Compute Agent
2025-07-18T15:02:10.6509343Z Version: 20250711.363
2025-07-18T15:02:10.6509941Z Commit: 6785254374ce925a23743850c1cb91912ce5c14c
2025-07-18T15:02:10.6510659Z Build Date: 2025-07-11T20:04:25Z
2025-07-18T15:02:10.6511247Z ##[endgroup]
2025-07-18T15:02:10.6511764Z ##[group]Operating System
2025-07-18T15:02:10.6512380Z Ubuntu
2025-07-18T15:02:10.6512837Z 24.04.2
2025-07-18T15:02:10.6513248Z LTS
2025-07-18T15:02:10.6513746Z ##[endgroup]
2025-07-18T15:02:10.6514190Z ##[group]Runner Image
2025-07-18T15:02:10.6514760Z Image: ubuntu-24.04
2025-07-18T15:02:10.6515318Z Version: 20250710.1.0
2025-07-18T15:02:10.6516614Z Included Software: https://github.com/actions/runner-images/blob/ubuntu24/20250710.1/images/ubuntu/Ubuntu2404-Readme.md
2025-07-18T15:02:10.6518219Z Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu24%2F20250710.1
2025-07-18T15:02:10.6519207Z ##[endgroup]
2025-07-18T15:02:10.6520273Z ##[group]GITHUB_TOKEN Permissions
2025-07-18T15:02:10.6522387Z Contents: read
2025-07-18T15:02:10.6522945Z Metadata: read
2025-07-18T15:02:10.6523473Z Packages: read
2025-07-18T15:02:10.6523995Z ##[endgroup]
2025-07-18T15:02:10.6526606Z Secret source: Actions
2025-07-18T15:02:10.6527566Z Prepare workflow directory
2025-07-18T15:02:10.6885209Z Prepare all required actions
2025-07-18T15:02:10.6923456Z Getting action download info
2025-07-18T15:02:11.0584259Z ##[group]Download immutable action package 'actions/checkout@v4'
2025-07-18T15:02:11.0585665Z Version: 4.2.2
2025-07-18T15:02:11.0586906Z Digest: sha256:ccb2698953eaebd21c7bf6268a94f9c26518a7e38e27e0b83c1fe1ad049819b1
2025-07-18T15:02:11.0588179Z Source commit SHA: 11bd71901bbe5b1630ceea73d27597364c9af683
2025-07-18T15:02:11.0589038Z ##[endgroup]
2025-07-18T15:02:11.1590915Z ##[group]Download immutable action package 'actions/setup-node@v4'
2025-07-18T15:02:11.1591871Z Version: 4.4.0
2025-07-18T15:02:11.1592656Z Digest: sha256:9427cefe82346e992fb5b949e3569b39d537ae41aa3086483b14eceebfc16bc1
2025-07-18T15:02:11.1593706Z Source commit SHA: 49933ea5288caeca8642d1e84afbd3f7d6820020
2025-07-18T15:02:11.1594394Z ##[endgroup]
2025-07-18T15:02:11.2519662Z Download action repository 'Azure/static-web-apps-deploy@v1' (SHA:4d27395796ac319302594769cfe812bd207490b1)
2025-07-18T15:02:11.6717429Z Complete job name: Build and Deploy Job
2025-07-18T15:02:11.7209376Z ##[group]Build container for action use: '/home/runner/work/_actions/Azure/static-web-apps-deploy/v1/Dockerfile'.
2025-07-18T15:02:11.7292300Z ##[command]/usr/bin/docker build -t 402916:3df4c7fb96c747f29118f1f24a74fe10 -f "/home/runner/work/_actions/Azure/static-web-apps-deploy/v1/Dockerfile" "/home/runner/work/_actions/Azure/static-web-apps-deploy/v1"
2025-07-18T15:02:14.7603292Z #0 building with "default" instance using docker driver
2025-07-18T15:02:14.7603892Z 
2025-07-18T15:02:14.7604074Z #1 [internal] load build definition from Dockerfile
2025-07-18T15:02:14.7604615Z #1 transferring dockerfile: 160B 0.0s done
2025-07-18T15:02:14.7605159Z #1 DONE 0.0s
2025-07-18T15:02:14.7605584Z 
2025-07-18T15:02:14.7606002Z #2 [internal] load metadata for mcr.microsoft.com/appsvc/staticappsclient:stable
2025-07-18T15:02:14.7765734Z #2 DONE 0.2s
2025-07-18T15:02:14.8983433Z 
2025-07-18T15:02:14.8983964Z #3 [internal] load .dockerignore
2025-07-18T15:02:14.8984843Z #3 transferring context: 2B done
2025-07-18T15:02:14.8985321Z #3 DONE 0.0s
2025-07-18T15:02:14.8985786Z 
2025-07-18T15:02:14.8986005Z #4 [internal] load build context
2025-07-18T15:02:14.8986528Z #4 transferring context: 107B done
2025-07-18T15:02:14.8987013Z #4 DONE 0.0s
2025-07-18T15:02:14.8987259Z 
2025-07-18T15:02:14.8987925Z #5 [1/2] FROM mcr.microsoft.com/appsvc/staticappsclient:stable@sha256:41473a2ebc45daa6e63c82a7f32a5680b0fe34dac49ab85dd6369c764b191308
2025-07-18T15:02:14.8989450Z #5 resolve mcr.microsoft.com/appsvc/staticappsclient:stable@sha256:41473a2ebc45daa6e63c82a7f32a5680b0fe34dac49ab85dd6369c764b191308 done
2025-07-18T15:02:14.8991224Z #5 sha256:b3ff24b88ad3798f817849ad391d809ece121dc9b7f82f24bb68eed84561f048 3.15MB / 54.59MB 0.1s
2025-07-18T15:02:14.8992238Z #5 sha256:41473a2ebc45daa6e63c82a7f32a5680b0fe34dac49ab85dd6369c764b191308 2.71kB / 2.71kB done
2025-07-18T15:02:14.8993304Z #5 sha256:ac323bdaa10f869bd9e7adecd8f5326e44acc4c59168868108b1cdf3891089cc 11.53MB / 55.09MB 0.1s
2025-07-18T15:02:14.8994353Z #5 sha256:84811b2a563b9003abbd1c06f6e45a857315b931855030bdd0443d13d950a996 4.19MB / 15.76MB 0.1s
2025-07-18T15:02:14.8995102Z #5 sha256:c4961ea170d16177c6dec81c5b9e721a02636907f90fc43917ad54d55ab89087 13.35kB / 13.35kB done
2025-07-18T15:02:15.0980135Z #5 sha256:b3ff24b88ad3798f817849ad391d809ece121dc9b7f82f24bb68eed84561f048 54.59MB / 54.59MB 0.3s
2025-07-18T15:02:15.0981714Z #5 sha256:ac323bdaa10f869bd9e7adecd8f5326e44acc4c59168868108b1cdf3891089cc 55.09MB / 55.09MB 0.3s done
2025-07-18T15:02:15.0983213Z #5 sha256:84811b2a563b9003abbd1c06f6e45a857315b931855030bdd0443d13d950a996 15.76MB / 15.76MB 0.2s done
2025-07-18T15:02:15.0997748Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 20.97MB / 196.99MB 0.3s
2025-07-18T15:02:15.1987552Z #5 sha256:b3ff24b88ad3798f817849ad391d809ece121dc9b7f82f24bb68eed84561f048 54.59MB / 54.59MB 0.3s done
2025-07-18T15:02:15.1989247Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 48.23MB / 196.99MB 0.4s
2025-07-18T15:02:15.1990322Z #5 extracting sha256:ac323bdaa10f869bd9e7adecd8f5326e44acc4c59168868108b1cdf3891089cc
2025-07-18T15:02:15.1992442Z #5 sha256:7c32381cbc15887afa5092d985e48bd3ce82af22ca1c343be2fcb39d4caa2143 1.56MB / 1.56MB 0.4s done
2025-07-18T15:02:15.1993503Z #5 sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 0B / 72.28MB 0.4s
2025-07-18T15:02:15.1995116Z #5 sha256:9f9b29a4bb02782e9ef637948482cf6186b2cfea4bfecee192ad953107a7b130 19.32MB / 80.86MB 0.4s
2025-07-18T15:02:15.1997244Z #5 sha256:4f4fb700ef54461cfa02571ae0db9a0dc1e0cdb5577484a6d75e68dc38e8acc1 32B / 32B 0.3s done
2025-07-18T15:02:15.3068259Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 72.19MB / 196.99MB 0.5s
2025-07-18T15:02:15.3070233Z #5 sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 29.36MB / 72.28MB 0.5s
2025-07-18T15:02:15.3072900Z #5 sha256:9f9b29a4bb02782e9ef637948482cf6186b2cfea4bfecee192ad953107a7b130 47.19MB / 80.86MB 0.5s
2025-07-18T15:02:15.4341836Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 91.23MB / 196.99MB 0.6s
2025-07-18T15:02:15.4348756Z #5 sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 59.77MB / 72.28MB 0.6s
2025-07-18T15:02:15.4352494Z #5 sha256:9f9b29a4bb02782e9ef637948482cf6186b2cfea4bfecee192ad953107a7b130 77.59MB / 80.86MB 0.6s
2025-07-18T15:02:15.5358976Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 110.10MB / 196.99MB 0.7s
2025-07-18T15:02:15.5364927Z #5 sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 72.28MB / 72.28MB 0.7s
2025-07-18T15:02:15.5369419Z #5 sha256:9f9b29a4bb02782e9ef637948482cf6186b2cfea4bfecee192ad953107a7b130 80.86MB / 80.86MB 0.6s done
2025-07-18T15:02:15.5370627Z #5 sha256:095fb23ecbf649df312cb6981dd528233a1af3d4a040165bcc0c37590c9e62a4 115.53kB / 115.53kB 0.7s
2025-07-18T15:02:15.6631590Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 138.52MB / 196.99MB 0.8s
2025-07-18T15:02:15.6634230Z #5 sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 72.28MB / 72.28MB 0.7s done
2025-07-18T15:02:15.6635615Z #5 sha256:095fb23ecbf649df312cb6981dd528233a1af3d4a040165bcc0c37590c9e62a4 115.53kB / 115.53kB 0.7s done
2025-07-18T15:02:15.6636855Z #5 sha256:218a528d080a1bebdabe150b46ac3853b986c047c42f1f5b42c3544b7fdfe841 1.16MB / 1.16MB 0.7s done
2025-07-18T15:02:15.6637819Z #5 sha256:fc089199951098f589969385263430a7644c55e648f3691c2522efbcd5ff36d9 169B / 169B 0.8s done
2025-07-18T15:02:15.6638871Z #5 sha256:e8e496d4f914a3099ff9504db622ffe27eddc493f797c4705b0bddc6683bb9f8 643.40kB / 643.40kB 0.7s done
2025-07-18T15:02:15.6640290Z #5 sha256:2b22defda84c5a2fffe4ed153f8a3323fc7215a67b9bd62a7d66a7c56f5e8b9a 5.76MB / 34.82MB 0.8s
2025-07-18T15:02:15.6641337Z #5 sha256:4c6a44587e13e5c37d3f6d6f61aad47cb49baa4e5b6b11aa02e8c83a6b5b4d3d 168B / 168B 0.8s done
2025-07-18T15:02:15.7678346Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 164.63MB / 196.99MB 0.9s
2025-07-18T15:02:15.7682196Z #5 sha256:2b22defda84c5a2fffe4ed153f8a3323fc7215a67b9bd62a7d66a7c56f5e8b9a 34.82MB / 34.82MB 0.9s
2025-07-18T15:02:15.8699743Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 188.74MB / 196.99MB 1.0s
2025-07-18T15:02:15.8701045Z #5 sha256:2b22defda84c5a2fffe4ed153f8a3323fc7215a67b9bd62a7d66a7c56f5e8b9a 34.82MB / 34.82MB 0.9s done
2025-07-18T15:02:16.1238611Z #5 sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 196.99MB / 196.99MB 1.3s done
2025-07-18T15:02:17.2150880Z #5 extracting sha256:ac323bdaa10f869bd9e7adecd8f5326e44acc4c59168868108b1cdf3891089cc 2.1s done
2025-07-18T15:02:17.3404314Z #5 extracting sha256:84811b2a563b9003abbd1c06f6e45a857315b931855030bdd0443d13d950a996 0.1s
2025-07-18T15:02:17.7852201Z #5 extracting sha256:84811b2a563b9003abbd1c06f6e45a857315b931855030bdd0443d13d950a996 0.4s done
2025-07-18T15:02:18.8378925Z #5 extracting sha256:b3ff24b88ad3798f817849ad391d809ece121dc9b7f82f24bb68eed84561f048
2025-07-18T15:02:20.8851589Z #5 extracting sha256:b3ff24b88ad3798f817849ad391d809ece121dc9b7f82f24bb68eed84561f048 1.9s done
2025-07-18T15:02:20.9840126Z #5 extracting sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e
2025-07-18T15:02:25.8100113Z #5 extracting sha256:c6f58f24df78e3aabf785017c3197c2a09fd606e7f19a830a1cfde41f681f39e 4.8s done
2025-07-18T15:02:26.9658573Z #5 extracting sha256:4f4fb700ef54461cfa02571ae0db9a0dc1e0cdb5577484a6d75e68dc38e8acc1
2025-07-18T15:02:27.0966594Z #5 extracting sha256:4f4fb700ef54461cfa02571ae0db9a0dc1e0cdb5577484a6d75e68dc38e8acc1 done
2025-07-18T15:02:27.0967985Z #5 extracting sha256:9f9b29a4bb02782e9ef637948482cf6186b2cfea4bfecee192ad953107a7b130 0.1s
2025-07-18T15:02:29.6137304Z #5 extracting sha256:9f9b29a4bb02782e9ef637948482cf6186b2cfea4bfecee192ad953107a7b130 2.5s done
2025-07-18T15:02:29.7729913Z #5 extracting sha256:7c32381cbc15887afa5092d985e48bd3ce82af22ca1c343be2fcb39d4caa2143
2025-07-18T15:02:30.0205992Z #5 extracting sha256:7c32381cbc15887afa5092d985e48bd3ce82af22ca1c343be2fcb39d4caa2143 0.1s done
2025-07-18T15:02:30.0210039Z #5 extracting sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 0.1s
2025-07-18T15:02:31.0011431Z #5 extracting sha256:5715d6ba5c0ffccc0bcdf9d1d2dd8ce68b580cd2f45d982886db8fe278df83b9 0.9s done
2025-07-18T15:02:31.0748449Z #5 extracting sha256:095fb23ecbf649df312cb6981dd528233a1af3d4a040165bcc0c37590c9e62a4
2025-07-18T15:02:31.1930294Z #5 extracting sha256:095fb23ecbf649df312cb6981dd528233a1af3d4a040165bcc0c37590c9e62a4 done
2025-07-18T15:02:31.1931450Z #5 extracting sha256:218a528d080a1bebdabe150b46ac3853b986c047c42f1f5b42c3544b7fdfe841 0.1s done
2025-07-18T15:02:31.3149245Z #5 extracting sha256:e8e496d4f914a3099ff9504db622ffe27eddc493f797c4705b0bddc6683bb9f8 0.0s done
2025-07-18T15:02:31.3150262Z #5 extracting sha256:2b22defda84c5a2fffe4ed153f8a3323fc7215a67b9bd62a7d66a7c56f5e8b9a 0.1s
2025-07-18T15:02:31.6271542Z #5 extracting sha256:2b22defda84c5a2fffe4ed153f8a3323fc7215a67b9bd62a7d66a7c56f5e8b9a 0.4s done
2025-07-18T15:02:31.6274361Z #5 extracting sha256:4c6a44587e13e5c37d3f6d6f61aad47cb49baa4e5b6b11aa02e8c83a6b5b4d3d
2025-07-18T15:02:31.8610813Z #5 extracting sha256:4c6a44587e13e5c37d3f6d6f61aad47cb49baa4e5b6b11aa02e8c83a6b5b4d3d done
2025-07-18T15:02:31.8612228Z #5 extracting sha256:fc089199951098f589969385263430a7644c55e648f3691c2522efbcd5ff36d9 done
2025-07-18T15:02:31.8612967Z #5 DONE 16.9s
2025-07-18T15:02:31.8613159Z 
2025-07-18T15:02:31.8613331Z #6 [2/2] COPY entrypoint.sh /entrypoint.sh
2025-07-18T15:02:31.8613721Z #6 DONE 0.0s
2025-07-18T15:02:31.8613884Z 
2025-07-18T15:02:31.8614008Z #7 exporting to image
2025-07-18T15:02:31.8614796Z #7 exporting layers
2025-07-18T15:02:32.8981612Z #7 exporting layers 1.2s done
2025-07-18T15:02:32.9189648Z #7 writing image sha256:b587546a14b4aed727888e58a5f8734d87077d772aafee2f90918f20e7c430bd done
2025-07-18T15:02:32.9190585Z #7 naming to docker.io/library/402916:3df4c7fb96c747f29118f1f24a74fe10 done
2025-07-18T15:02:32.9231903Z #7 DONE 1.2s
2025-07-18T15:02:32.9239877Z ##[endgroup]
2025-07-18T15:02:32.9500140Z ##[group]Run actions/checkout@v4
2025-07-18T15:02:32.9500688Z with:
2025-07-18T15:02:32.9500878Z   submodules: true
2025-07-18T15:02:32.9501104Z   repository: 365Evergreen/static-web-app
2025-07-18T15:02:32.9501572Z   token: ***
2025-07-18T15:02:32.9501755Z   ssh-strict: true
2025-07-18T15:02:32.9501933Z   ssh-user: git
2025-07-18T15:02:32.9502126Z   persist-credentials: true
2025-07-18T15:02:32.9502355Z   clean: true
2025-07-18T15:02:32.9502545Z   sparse-checkout-cone-mode: true
2025-07-18T15:02:32.9502780Z   fetch-depth: 1
2025-07-18T15:02:32.9502968Z   fetch-tags: false
2025-07-18T15:02:32.9503169Z   show-progress: true
2025-07-18T15:02:32.9503362Z   lfs: false
2025-07-18T15:02:32.9503535Z   set-safe-directory: true
2025-07-18T15:02:32.9503922Z ##[endgroup]
2025-07-18T15:02:33.0597743Z Syncing repository: 365Evergreen/static-web-app
2025-07-18T15:02:33.0599511Z ##[group]Getting Git version info
2025-07-18T15:02:33.0600181Z Working directory is '/home/runner/work/static-web-app/static-web-app'
2025-07-18T15:02:33.0601063Z [command]/usr/bin/git version
2025-07-18T15:02:33.0611743Z git version 2.50.1
2025-07-18T15:02:33.0638006Z ##[endgroup]
2025-07-18T15:02:33.0651916Z Temporarily overriding HOME='/home/runner/work/_temp/a63c4fc2-5c85-41b2-b8cc-94973ee15c5b' before making global git config changes
2025-07-18T15:02:33.0653184Z Adding repository directory to the temporary git global config as a safe directory
2025-07-18T15:02:33.0664993Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/static-web-app/static-web-app
2025-07-18T15:02:33.0699660Z Deleting the contents of '/home/runner/work/static-web-app/static-web-app'
2025-07-18T15:02:33.0702904Z ##[group]Initializing the repository
2025-07-18T15:02:33.0707139Z [command]/usr/bin/git init /home/runner/work/static-web-app/static-web-app
2025-07-18T15:02:33.0763194Z hint: Using 'master' as the name for the initial branch. This default branch name
2025-07-18T15:02:33.0764333Z hint: is subject to change. To configure the initial branch name to use in all
2025-07-18T15:02:33.0765230Z hint: of your new repositories, which will suppress this warning, call:
2025-07-18T15:02:33.0766046Z hint:
2025-07-18T15:02:33.0766485Z hint: 	git config --global init.defaultBranch <name>
2025-07-18T15:02:33.0766998Z hint:
2025-07-18T15:02:33.0767486Z hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
2025-07-18T15:02:33.0768113Z hint: 'development'. The just-created branch can be renamed via this command:
2025-07-18T15:02:33.0768545Z hint:
2025-07-18T15:02:33.0768807Z hint: 	git branch -m <name>
2025-07-18T15:02:33.0769097Z hint:
2025-07-18T15:02:33.0769477Z hint: Disable this message with "git config set advice.defaultBranchName false"
2025-07-18T15:02:33.0770098Z Initialized empty Git repository in /home/runner/work/static-web-app/static-web-app/.git/
2025-07-18T15:02:33.0778132Z [command]/usr/bin/git remote add origin https://github.com/365Evergreen/static-web-app
2025-07-18T15:02:33.0862203Z ##[endgroup]
2025-07-18T15:02:33.0862808Z ##[group]Disabling automatic garbage collection
2025-07-18T15:02:33.0866892Z [command]/usr/bin/git config --local gc.auto 0
2025-07-18T15:02:33.0896691Z ##[endgroup]
2025-07-18T15:02:33.0897276Z ##[group]Setting up auth
2025-07-18T15:02:33.0904761Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2025-07-18T15:02:33.0936172Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
2025-07-18T15:02:33.1208070Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2025-07-18T15:02:33.1239936Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
2025-07-18T15:02:33.1468510Z [command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***
2025-07-18T15:02:33.1509950Z ##[endgroup]
2025-07-18T15:02:33.1510385Z ##[group]Fetching the repository
2025-07-18T15:02:33.1528406Z [command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +43221d2d8eb078d07a2da561284966b88376c809:refs/remotes/origin/main
2025-07-18T15:02:34.2595130Z From https://github.com/365Evergreen/static-web-app
2025-07-18T15:02:34.2596053Z  * [new ref]         43221d2d8eb078d07a2da561284966b88376c809 -> origin/main
2025-07-18T15:02:34.2620516Z ##[endgroup]
2025-07-18T15:02:34.2620896Z ##[group]Determining the checkout info
2025-07-18T15:02:34.2623126Z ##[endgroup]
2025-07-18T15:02:34.2628568Z [command]/usr/bin/git sparse-checkout disable
2025-07-18T15:02:34.2722973Z [command]/usr/bin/git config --local --unset-all extensions.worktreeConfig
2025-07-18T15:02:34.2760370Z ##[group]Checking out the ref
2025-07-18T15:02:34.2763059Z [command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main
2025-07-18T15:02:34.3342697Z Switched to a new branch 'main'
2025-07-18T15:02:34.3343450Z branch 'main' set up to track 'origin/main'.
2025-07-18T15:02:34.3350740Z ##[endgroup]
2025-07-18T15:02:34.3351361Z ##[group]Setting up auth for fetching submodules
2025-07-18T15:02:34.3357746Z [command]/usr/bin/git config --global http.https://github.com/.extraheader AUTHORIZATION: basic ***
2025-07-18T15:02:34.3397443Z [command]/usr/bin/git config --global --unset-all url.https://github.com/.insteadOf
2025-07-18T15:02:34.3430051Z [command]/usr/bin/git config --global --add url.https://github.com/.insteadOf git@github.com:
2025-07-18T15:02:34.3463636Z [command]/usr/bin/git config --global --add url.https://github.com/.insteadOf org-55726264@github.com:
2025-07-18T15:02:34.3489862Z ##[endgroup]
2025-07-18T15:02:34.3490449Z ##[group]Fetching submodules
2025-07-18T15:02:34.3494287Z [command]/usr/bin/git submodule sync
2025-07-18T15:02:34.3722539Z [command]/usr/bin/git -c protocol.version=2 submodule update --init --force --depth=1
2025-07-18T15:02:34.3948749Z [command]/usr/bin/git submodule foreach git config --local gc.auto 0
2025-07-18T15:02:34.4172698Z ##[endgroup]
2025-07-18T15:02:34.4173333Z ##[group]Persisting credentials for submodules
2025-07-18T15:02:34.4179517Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'url\.https\:\/\/github\.com\/\.insteadOf' && git config --local --unset-all 'url.https://github.com/.insteadOf' || :"
2025-07-18T15:02:34.4409495Z [command]/usr/bin/git submodule foreach sh -c "git config --local 'http.https://github.com/.extraheader' 'AUTHORIZATION: basic ***' && git config --local --show-origin --name-only --get-regexp remote.origin.url"
2025-07-18T15:02:34.4632303Z [command]/usr/bin/git submodule foreach git config --local --add 'url.https://github.com/.insteadOf' 'git@github.com:'
2025-07-18T15:02:34.4851767Z [command]/usr/bin/git submodule foreach git config --local --add 'url.https://github.com/.insteadOf' 'org-55726264@github.com:'
2025-07-18T15:02:34.5070304Z ##[endgroup]
2025-07-18T15:02:34.5107473Z [command]/usr/bin/git log -1 --format=%H
2025-07-18T15:02:34.5130958Z 43221d2d8eb078d07a2da561284966b88376c809
2025-07-18T15:02:34.5331234Z ##[group]Run actions/setup-node@v4
2025-07-18T15:02:34.5331502Z with:
2025-07-18T15:02:34.5331685Z   node-version: 20.x
2025-07-18T15:02:34.5331878Z   always-auth: false
2025-07-18T15:02:34.5332064Z   check-latest: false
2025-07-18T15:02:34.5332377Z   token: ***
2025-07-18T15:02:34.5332547Z ##[endgroup]
2025-07-18T15:02:34.7081836Z Found in cache @ /opt/hostedtoolcache/node/20.19.3/x64
2025-07-18T15:02:34.7088855Z ##[group]Environment details
2025-07-18T15:02:34.9940166Z node: v20.19.3
2025-07-18T15:02:35.0018401Z npm: 10.8.2
2025-07-18T15:02:35.0018757Z yarn: 1.22.22
2025-07-18T15:02:35.0019386Z ##[endgroup]
2025-07-18T15:02:35.0090477Z ##[group]Run cd api
2025-07-18T15:02:35.0090740Z [36;1mcd api[0m
2025-07-18T15:02:35.0090932Z [36;1mnpm install[0m
2025-07-18T15:02:35.0091128Z [36;1mnpm run build[0m
2025-07-18T15:02:35.0127254Z shell: /usr/bin/bash -e {0}
2025-07-18T15:02:35.0127502Z ##[endgroup]
2025-07-18T15:02:37.8382979Z 
2025-07-18T15:02:37.8391137Z added 76 packages, and audited 77 packages in 3s
2025-07-18T15:02:37.8391517Z 
2025-07-18T15:02:37.8391791Z 18 packages are looking for funding
2025-07-18T15:02:37.8392205Z   run `npm fund` for details
2025-07-18T15:02:37.8392736Z 
2025-07-18T15:02:37.8392947Z found 0 vulnerabilities
2025-07-18T15:02:37.9593297Z 
2025-07-18T15:02:37.9593927Z > api@1.0.0 build
2025-07-18T15:02:37.9594351Z > tsc
2025-07-18T15:02:37.9594547Z 
2025-07-18T15:02:39.5128305Z ##[group]Run Azure/static-web-apps-deploy@v1
2025-07-18T15:02:39.5128615Z with:
2025-07-18T15:02:39.5129498Z   azure_static_web_apps_api_token: ***
2025-07-18T15:02:39.5129937Z   repo_token: ***
2025-07-18T15:02:39.5130124Z   action: upload
2025-07-18T15:02:39.5130307Z   app_location: /
2025-07-18T15:02:39.5130484Z   api_location: api
2025-07-18T15:02:39.5130672Z ##[endgroup]
2025-07-18T15:02:39.5228013Z ##[command]/usr/bin/docker run --name df4c7fb96c747f29118f1f24a74fe10_4b8e3d --label 402916 --workdir /github/workspace --rm -e "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN" -e "INPUT_REPO_TOKEN" -e "INPUT_ACTION" -e "INPUT_APP_LOCATION" -e "INPUT_API_LOCATION" -e "INPUT_OUTPUT_LOCATION" -e "INPUT_API_BUILD_COMMAND" -e "INPUT_APP_ARTIFACT_LOCATION" -e "INPUT_APP_BUILD_COMMAND" -e "INPUT_ROUTES_LOCATION" -e "INPUT_SKIP_APP_BUILD" -e "INPUT_CONFIG_FILE_LOCATION" -e "INPUT_SKIP_API_BUILD" -e "INPUT_PRODUCTION_BRANCH" -e "INPUT_DEPLOYMENT_ENVIRONMENT" -e "INPUT_IS_STATIC_EXPORT" -e "INPUT_DATA_API_LOCATION" -e "INPUT_GITHUB_ID_TOKEN" -e "HOME" -e "GITHUB_JOB" -e "GITHUB_REF" -e "GITHUB_SHA" -e "GITHUB_REPOSITORY" -e "GITHUB_REPOSITORY_OWNER" -e "GITHUB_REPOSITORY_OWNER_ID" -e "GITHUB_RUN_ID" -e "GITHUB_RUN_NUMBER" -e "GITHUB_RETENTION_DAYS" -e "GITHUB_RUN_ATTEMPT" -e "GITHUB_ACTOR_ID" -e "GITHUB_ACTOR" -e "GITHUB_WORKFLOW" -e "GITHUB_HEAD_REF" -e "GITHUB_BASE_REF" -e "GITHUB_EVENT_NAME" -e "GITHUB_SERVER_URL" -e "GITHUB_API_URL" -e "GITHUB_GRAPHQL_URL" -e "GITHUB_REF_NAME" -e "GITHUB_REF_PROTECTED" -e "GITHUB_REF_TYPE" -e "GITHUB_WORKFLOW_REF" -e "GITHUB_WORKFLOW_SHA" -e "GITHUB_REPOSITORY_ID" -e "GITHUB_TRIGGERING_ACTOR" -e "GITHUB_WORKSPACE" -e "GITHUB_ACTION" -e "GITHUB_EVENT_PATH" -e "GITHUB_ACTION_REPOSITORY" -e "GITHUB_ACTION_REF" -e "GITHUB_PATH" -e "GITHUB_ENV" -e "GITHUB_STEP_SUMMARY" -e "GITHUB_STATE" -e "GITHUB_OUTPUT" -e "RUNNER_OS" -e "RUNNER_ARCH" -e "RUNNER_NAME" -e "RUNNER_ENVIRONMENT" -e "RUNNER_TOOL_CACHE" -e "RUNNER_TEMP" -e "RUNNER_WORKSPACE" -e "ACTIONS_RUNTIME_URL" -e "ACTIONS_RUNTIME_TOKEN" -e "ACTIONS_CACHE_URL" -e "ACTIONS_RESULTS_URL" -e GITHUB_ACTIONS=true -e CI=true -v "/var/run/docker.sock":"/var/run/docker.sock" -v "/home/runner/work/_temp/_github_home":"/github/home" -v "/home/runner/work/_temp/_github_workflow":"/github/workflow" -v "/home/runner/work/_temp/_runner_file_commands":"/github/file_commands" -v "/home/runner/work/static-web-app/static-web-app":"/github/workspace" 402916:3df4c7fb96c747f29118f1f24a74fe10
2025-07-18T15:02:39.7905086Z DeploymentId: a60c60e1-9305-4a8e-ba31-183e042f19be
2025-07-18T15:02:39.7905537Z 
2025-07-18T15:02:39.9083176Z [37mTry to validate location at: '/github/workspace'.[0m
2025-07-18T15:02:39.9095683Z [37mApp Directory Location: '/' was found.[0m
2025-07-18T15:02:39.9096556Z [37mTry to validate location at: '/github/workspace/swa-db-connections'.[0m
2025-07-18T15:02:39.9098568Z [37mLooking for event info[0m
2025-07-18T15:02:41.0643045Z [37mStarting to build app with Oryx[0m
2025-07-18T15:02:41.0645121Z [33mAzure Static Web Apps utilizes Oryx to build both static applications and Azure Functions. You can find more details on Oryx here: https://github.com/microsoft/Oryx[0m
2025-07-18T15:02:41.0647187Z [37m---Oryx build logs---[0m
2025-07-18T15:02:41.0647489Z [37m[0m
2025-07-18T15:02:41.0647704Z [37m[0m
2025-07-18T15:02:41.4491391Z [37mOperation performed by Microsoft Oryx, https://github.com/Microsoft/Oryx[0m
2025-07-18T15:02:41.4492191Z [37mYou can report issues at https://github.com/Microsoft/Oryx/issues[0m
2025-07-18T15:02:41.4492575Z [37m[0m
2025-07-18T15:02:41.4493208Z [37mOryx Version: 0.2.20241003.1, Commit: d5352431d933306ccee1be9b5d822c73bf723e9e, ReleaseTagName: 20241003.1[0m
2025-07-18T15:02:41.4493750Z [37m[0m
2025-07-18T15:02:41.4494056Z [37mBuild Operation ID: ea9f0dbb0777cebd[0m
2025-07-18T15:02:41.4494414Z [37mOS Type           : bullseye[0m
2025-07-18T15:02:41.4494753Z [37mImage Type        : githubactions[0m
2025-07-18T15:02:41.4495008Z [37m[0m
2025-07-18T15:02:41.4656088Z [37mDetecting platforms...[0m
2025-07-18T15:02:41.5946339Z [37mCould not detect any platform in the source directory.[0m
2025-07-18T15:02:41.6125718Z [31mError: Could not detect the language from repo.[0m
2025-07-18T15:02:41.9272651Z [37m[0m
2025-07-18T15:02:41.9272909Z [37m[0m
2025-07-18T15:02:41.9273217Z [37m---End of Oryx build logs---[0m
2025-07-18T15:02:41.9293788Z [33mOryx was unable to determine the build steps. Continuing assuming the assets in this folder are already built. If this is an unexpected behavior please contact support.[0m
2025-07-18T15:02:42.8069274Z [37mFinished building app with Oryx[0m
2025-07-18T15:02:42.8347796Z [37mUsing 'staticwebapp.config.json' file for configuration information, 'routes.json' will be ignored.[0m
2025-07-18T15:02:43.6114426Z [37mTry to validate location at: '/github/workspace/api'.[0m
2025-07-18T15:02:43.6115753Z [37mApi Directory Location: 'api' was found.[0m
2025-07-18T15:02:43.6774278Z [37mStarting to build function app with Oryx[0m
2025-07-18T15:02:43.6775805Z [37m---Oryx build logs---[0m
2025-07-18T15:02:43.6776473Z [37m[0m
2025-07-18T15:02:43.6776756Z [37m[0m
2025-07-18T15:02:44.0325862Z [37mOperation performed by Microsoft Oryx, https://github.com/Microsoft/Oryx[0m
2025-07-18T15:02:44.0326658Z [37mYou can report issues at https://github.com/Microsoft/Oryx/issues[0m
2025-07-18T15:02:44.0327083Z [37m[0m
2025-07-18T15:02:44.0327803Z [37mOryx Version: 0.2.20241003.1, Commit: d5352431d933306ccee1be9b5d822c73bf723e9e, ReleaseTagName: 20241003.1[0m
2025-07-18T15:02:44.0328363Z [37m[0m
2025-07-18T15:02:44.0334547Z [37mBuild Operation ID: a7fc99e1761107e0[0m
2025-07-18T15:02:44.0334973Z [37mOS Type           : bullseye[0m
2025-07-18T15:02:44.0335494Z [37mImage Type        : githubactions[0m
2025-07-18T15:02:44.0335796Z [37m[0m
2025-07-18T15:02:44.0481358Z [37mDetecting platforms...[0m
2025-07-18T15:02:44.9402386Z [37mDetected following platforms:[0m
2025-07-18T15:02:44.9404272Z [37m  nodejs: 18.20.8[0m
2025-07-18T15:02:44.9443185Z [37mVersion '18.20.8' of platform 'nodejs' is not installed. Generating script to install it...[0m
2025-07-18T15:02:44.9927448Z [37mDetected the following frameworks: Typescript[0m
2025-07-18T15:02:45.0946279Z [37m[0m
2025-07-18T15:02:45.1022299Z [37m[0m
2025-07-18T15:02:45.1026468Z [37mSource directory     : /github/workspace/api[0m
2025-07-18T15:02:45.1030213Z [37mDestination directory: /bin/staticsites/a60c60e1-9305-4a8e-ba31-183e042f19be-swa-oryx/api[0m
2025-07-18T15:02:45.1031047Z [37m[0m
2025-07-18T15:02:45.1038288Z [37m[0m
2025-07-18T15:02:45.1041612Z [37mDownloading and extracting 'nodejs' version '18.20.8' to '/tmp/oryx/platforms/nodejs/18.20.8'...[0m
2025-07-18T15:02:45.1071978Z [37mDetected image debian flavor: bullseye.[0m
2025-07-18T15:02:46.7286690Z [37mDownloaded in 1 sec(s).[0m
2025-07-18T15:02:46.7288469Z [37mVerifying checksum...[0m
2025-07-18T15:02:46.7340955Z [37mExtracting contents...[0m
2025-07-18T15:02:47.7783855Z [37mperforming sha512 checksum for: nodejs...[0m
2025-07-18T15:02:47.9098559Z [37mDone in 2 sec(s).[0m
2025-07-18T15:02:47.9099119Z [37m[0m
2025-07-18T15:02:47.9587683Z [37mRemoving existing manifest file[0m
2025-07-18T15:02:47.9599355Z [37mCreating directory for command manifest file if it does not exist[0m
2025-07-18T15:02:47.9635892Z [37mCreating a manifest file...[0m
2025-07-18T15:02:47.9646751Z [37mNode Build Command Manifest file created.[0m
2025-07-18T15:02:47.9647316Z [37m[0m
2025-07-18T15:02:47.9647706Z [37mUsing Node version:[0m
2025-07-18T15:02:47.9688123Z [37mv18.20.8[0m
2025-07-18T15:02:47.9698671Z [37m[0m
2025-07-18T15:02:47.9707494Z [37mUsing Npm version:[0m
2025-07-18T15:02:48.0798917Z [37m10.8.2[0m
2025-07-18T15:02:48.0904060Z [37m[0m
2025-07-18T15:02:48.0904812Z [37mInstalling production dependencies in '/github/workspace/api/.oryx_prod_node_modules'...[0m
2025-07-18T15:02:48.0905304Z [37m[0m
2025-07-18T15:02:48.0905959Z [37mRunning 'npm install --production'...[0m
2025-07-18T15:02:48.0906533Z [37m[0m
2025-07-18T15:02:48.2014278Z [31mnpm warn config production Use `--omit=dev` instead.[0m
2025-07-18T15:02:48.5253836Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5260522Z [31mnpm warn EBADENGINE   package: '@azure/core-auth@1.10.0',[0m
2025-07-18T15:02:48.5261896Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5262941Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5263673Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5264274Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5265120Z [31mnpm warn EBADENGINE   package: '@azure/core-client@1.10.0',[0m
2025-07-18T15:02:48.5266178Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5267313Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5268162Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5272019Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5273205Z [31mnpm warn EBADENGINE   package: '@azure/core-rest-pipeline@1.22.0',[0m
2025-07-18T15:02:48.5275238Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5277829Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5278610Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5279230Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5280066Z [31mnpm warn EBADENGINE   package: '@azure/core-tracing@1.3.0',[0m
2025-07-18T15:02:48.5280934Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5281845Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5283532Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5284467Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5285300Z [31mnpm warn EBADENGINE   package: '@azure/core-util@1.13.0',[0m
2025-07-18T15:02:48.5286348Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5287230Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5287670Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5288028Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5288500Z [31mnpm warn EBADENGINE   package: '@azure/identity@4.10.2',[0m
2025-07-18T15:02:48.5288991Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5289520Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5289933Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5290287Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5290849Z [31mnpm warn EBADENGINE   package: '@azure/logger@1.3.0',[0m
2025-07-18T15:02:48.5291469Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5291985Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5292658Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:48.5293007Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:48.5293522Z [31mnpm warn EBADENGINE   package: '@typespec/ts-http-runtime@0.3.0',[0m
2025-07-18T15:02:48.5294045Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:48.5294567Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:48.5294975Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:50.8462041Z [37m[0m
2025-07-18T15:02:50.8463037Z [37madded 72 packages, and audited 73 packages in 3s[0m
2025-07-18T15:02:50.8465842Z [37m[0m
2025-07-18T15:02:50.8466360Z [37m18 packages are looking for funding[0m
2025-07-18T15:02:50.8466968Z [37m  run `npm fund` for details[0m
2025-07-18T15:02:50.8482149Z [37m[0m
2025-07-18T15:02:50.8483716Z [37mfound 0 vulnerabilities[0m
2025-07-18T15:02:50.8637509Z [37m[0m
2025-07-18T15:02:50.8639322Z [37mCopying production dependencies from '/github/workspace/api/.oryx_prod_node_modules' to '/github/workspace/api/node_modules'...[0m
2025-07-18T15:02:51.0671324Z [37mDone in 1 sec(s).[0m
2025-07-18T15:02:51.1955020Z [37m[0m
2025-07-18T15:02:51.1955617Z [37mRunning 'npm install'...[0m
2025-07-18T15:02:51.1955989Z [37m[0m
2025-07-18T15:02:51.6285688Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6289835Z [31mnpm warn EBADENGINE   package: '@azure/core-auth@1.10.0',[0m
2025-07-18T15:02:51.6291411Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6299160Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6299910Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6300508Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6301383Z [31mnpm warn EBADENGINE   package: '@azure/core-client@1.10.0',[0m
2025-07-18T15:02:51.6302304Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6303287Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6304003Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6304689Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6305809Z [31mnpm warn EBADENGINE   package: '@azure/core-rest-pipeline@1.22.0',[0m
2025-07-18T15:02:51.6306754Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6307724Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6308464Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6309158Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6310072Z [31mnpm warn EBADENGINE   package: '@azure/core-tracing@1.3.0',[0m
2025-07-18T15:02:51.6310991Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6311978Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6312744Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6313398Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6314278Z [31mnpm warn EBADENGINE   package: '@azure/core-util@1.13.0',[0m
2025-07-18T15:02:51.6315177Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6316445Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6317201Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6329205Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6353054Z [31mnpm warn EBADENGINE   package: '@azure/identity@4.10.2',[0m
2025-07-18T15:02:51.6354032Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6355047Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6361465Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6363514Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6366097Z [31mnpm warn EBADENGINE   package: '@azure/logger@1.3.0',[0m
2025-07-18T15:02:51.6369403Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6370484Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6371325Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.6371987Z [31mnpm warn EBADENGINE Unsupported engine {[0m
2025-07-18T15:02:51.6372985Z [31mnpm warn EBADENGINE   package: '@typespec/ts-http-runtime@0.3.0',[0m
2025-07-18T15:02:51.6373985Z [31mnpm warn EBADENGINE   required: { node: '>=20.0.0' },[0m
2025-07-18T15:02:51.6375011Z [31mnpm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }[0m
2025-07-18T15:02:51.6376065Z [31mnpm warn EBADENGINE }[0m
2025-07-18T15:02:51.8530906Z [37m[0m
2025-07-18T15:02:51.8533166Z [37mup to date, audited 77 packages in 585ms[0m
2025-07-18T15:02:51.8534935Z [37m[0m
2025-07-18T15:02:51.8535930Z [37m18 packages are looking for funding[0m
2025-07-18T15:02:51.8536807Z [37m  run `npm fund` for details[0m
2025-07-18T15:02:51.8542932Z [37m[0m
2025-07-18T15:02:51.8543911Z [37mfound 0 vulnerabilities[0m
2025-07-18T15:02:51.8617774Z [37m[0m
2025-07-18T15:02:51.8618322Z [37mRunning 'npm run build'...[0m
2025-07-18T15:02:51.8618761Z [37m[0m
2025-07-18T15:02:51.9939975Z [37m[0m
2025-07-18T15:02:51.9940462Z [37m> api@1.0.0 build[0m
2025-07-18T15:02:51.9940906Z [37m> tsc[0m
2025-07-18T15:02:51.9941253Z [37m[0m
2025-07-18T15:02:53.5494061Z [37m[0m
2025-07-18T15:02:53.5494882Z [37mCopy '/github/workspace/api/node_modules' with all dependencies to '/github/workspace/api/.oryx_all_node_modules'...[0m
2025-07-18T15:02:54.2209721Z [37m[0m
2025-07-18T15:02:54.2211378Z [37mCopying production dependencies from '/github/workspace/api/.oryx_prod_node_modules/node_modules' to '/github/workspace/api/node_modules'...[0m
2025-07-18T15:02:54.4641020Z [37mPreparing output...[0m
2025-07-18T15:02:54.4641380Z [37m[0m
2025-07-18T15:02:54.4642176Z [37mCopying files to destination directory '/bin/staticsites/a60c60e1-9305-4a8e-ba31-183e042f19be-swa-oryx/api'...[0m
2025-07-18T15:02:55.2598920Z [37mDone in 1 sec(s).[0m
2025-07-18T15:02:55.2618570Z [37m[0m
2025-07-18T15:02:55.2620051Z [37mRemoving existing manifest file[0m
2025-07-18T15:02:55.2634531Z [37mCreating a manifest file...[0m
2025-07-18T15:02:55.2640802Z [37mManifest file created.[0m
2025-07-18T15:02:55.2642203Z [37mCopying .ostype to manifest output directory.[0m
2025-07-18T15:02:55.2659092Z [37m[0m
2025-07-18T15:02:55.2659596Z [37mDone in 10 sec(s).[0m
2025-07-18T15:02:55.4571394Z [37m[0m
2025-07-18T15:02:55.4571795Z [37m[0m
2025-07-18T15:02:55.4572300Z [37m---End of Oryx build logs---[0m
2025-07-18T15:02:55.4590637Z [33mFunction Runtime Information. OS: linux, Functions Runtime: ~4, node version: 18[0m
2025-07-18T15:02:55.4591922Z [37mFinished building function app with Oryx[0m
2025-07-18T15:02:55.9154755Z [37mZipping Api Artifacts[0m
2025-07-18T15:02:57.1612144Z [37mDone Zipping Api Artifacts[0m
2025-07-18T15:02:57.8984670Z [37mZipping App Artifacts[0m
2025-07-18T15:03:01.6601951Z [37mDone Zipping App Artifacts[0m
2025-07-18T15:03:07.5102702Z [37mUploading build artifacts.[0m
2025-07-18T15:03:07.5103532Z [32mFinished Upload. Polling on deployment.[0m
2025-07-18T15:03:07.8023049Z [37mStatus: InProgress. Time: 0.2915359(s)[0m
2025-07-18T15:03:23.2680027Z [37mStatus: InProgress. Time: 15.757695(s)[0m
2025-07-18T15:03:38.5475672Z [37mStatus: Succeeded. Time: 31.0372367(s)[0m
2025-07-18T15:03:38.5476140Z [32mDeployment Complete :)[0m
2025-07-18T15:03:38.5476777Z [32mVisit your site at: https://polite-smoke-056b0d100.2.azurestaticapps.net[0m
2025-07-18T15:03:38.7519249Z [37mThanks for using Azure Static Web Apps![0m
2025-07-18T15:03:38.7519947Z [37mExiting[0m
2025-07-18T15:03:39.5216481Z Post job cleanup.
2025-07-18T15:03:39.6932183Z Post job cleanup.
2025-07-18T15:03:39.7928074Z [command]/usr/bin/git version
2025-07-18T15:03:39.7967608Z git version 2.50.1
2025-07-18T15:03:39.8015620Z Temporarily overriding HOME='/home/runner/work/_temp/de294d14-1564-45ac-909f-f1da2ea5aba2' before making global git config changes
2025-07-18T15:03:39.8017508Z Adding repository directory to the temporary git global config as a safe directory
2025-07-18T15:03:39.8023085Z [command]/usr/bin/git config --global --add safe.directory /home/runner/work/static-web-app/static-web-app
2025-07-18T15:03:39.8069998Z [command]/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
2025-07-18T15:03:39.8108598Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
2025-07-18T15:03:39.8373093Z [command]/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
2025-07-18T15:03:39.8402964Z http.https://github.com/.extraheader
2025-07-18T15:03:39.8418008Z [command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
2025-07-18T15:03:39.8456086Z [command]/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
2025-07-18T15:03:39.8830495Z Cleaning up orphan processes
