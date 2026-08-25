pipeline{
	agent any
	options{
		timestamps()
		disableConcurrentBuilds()
	}
	environment{
		BACKEND_IMAGE= 'rk-task-backend'
		FRONTEND_IMAGE = 'rk-task-frontend'
		IMAGE_TAG = "${BUILD_NUMBER}"
	}
	stages{
		stage('Checkout'){
			steps{
				echo 'Checking Out Source Code....'
				checkout scm
			}
		}
		stage('Verify Project Structure'){
			steps{
				sh '''
					test -f backend/package.json
					test -f backend/dockerfile
					test -f frontend/package.json
					test -f frontend/dockerfile
					test -f docker-compose.yaml
				'''
			}
		}
		stage('Install Backend Dependencies'){
			steps{
				dir('backend'){
					sh 'npm ci'
				}
			}
		}
		stage('Install Frontend Dependencies'){
			steps{
				dir('frontend'){
					sh 'npm ci'
				}
			}
		}
		stage('Test Backend'){
			steps{
				dir('backend'){
					sh 'npm run test --if-present'
				}			
			}
		}
		stage('Test Frontend'){
			steps{
				dir('frontend'){
					sh 'npm run test --if-present'
				}
			}
		}
		stage('Build Frontend'){
			steps{
				dir('frontend'){
					sh 'npm run build '
				}
			}
		}
		stage('Verify Docker'){
			steps{
				sh '''
					docker version
					docker info
				'''
			}
		}
		stage('Build Backend Image'){
			steps{
				echo "Building ${BACKEND_IMAGE}:${IMAGE_TAG}"
				sh '''
					docker build \
					 --tag ${BACKEND_IMAGE}:${IMAGE_TAG} \
					./backend
				'''
			}
		}
		stage('Build Frontend Image'){
			steps{
				echo "Building ${FRONTEND_IMAGE}:${IMAGE_TAG}"
				sh '''
					docker build \
					--tag ${FRONTEND_IMAGE}:${IMAGE_TAG} \
					./frontend 
				'''
			}
		}
		stage('Verify Docker Image'){
			steps{
				sh '''
					docker image inspect ${BACKEND_IMAGE}:${IMAGE_TAG}
					docker image inspect ${FRONTEND_IMAGE}:${IMAGE_TAG}

					docker image ls \
					--filter reference="${BACKEND_IMAGE}:${IMAGE_TAG}" \
					--filter reference="${FRONTEND_IMAGE}:${IMAGE_TAG}"
				'''
			}
		}
	}
	post {
		success {
			echo "DOCKER images build successfully with ${IMAGE_TAG}"
		}
		failure {
			echo "Pipeline failed, Docker image will not be deployed"
		}
		always {
			echo "Pipeline finished with status: ${currentBuild.currentResult}"
		}
	}
}

