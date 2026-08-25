pipeline{
	agent any
	options{
		timestamps()
		disableConcurrentBuils()
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
					test -f frontend/package.json
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
	}
	post {
		success {
			echo "CI pipeline completed successfully."
		}
		failure {
			echo "CI Pipeline failed. Check the failed stage."
		}
		always {
			echo "Pipeline finished with status: ${currentBuild.currentResult}"
		}
	}
}

