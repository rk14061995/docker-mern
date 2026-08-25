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
		COMPOSE_PROJECT_IMAGE = "mern-ci-${BUILD_NUMBER}"
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
					test -f backend/Dockerfile
					test -f frontend/package.json
					test -f frontend/Dockerfile
					test -f docker-compose.yaml
					test -f docker-compose.ci.yaml
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
		stage('Prepare CI Environment'){
			steps{
				writeFile(
					file: '.ci-mongo-password',
					text: 'jenkins-ci-password'
				)
				sh '''
					chmod 644 .ci-mongo-password
					docker compose -f docker-compose.ci.yaml config --quiet
				'''
			}
		}
		stage('Start Test Containers'){
			steps{
				sh '''
					docker compose -f docker-compose.ci.yaml up -d --wait --wait-timeout 120
				'''
			}
		}
		stage('Check Container Status'){
			steps{
				sh '''
					docker compose \
					-f docker-compose.ci.yaml \
					ps
				'''
			}
		}
		stage('Test Backed Container'){
			steps{
				echo " Test is pending"
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

