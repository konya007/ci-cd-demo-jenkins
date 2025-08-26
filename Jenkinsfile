pipeline {
    agent any
    options {
        skipDefaultCheckout(false)
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm ci || npm install'
            }
        }

        stage('Test PR to main') {
            when {
                allOf {
                    changeRequest()                    
                    expression { env.CHANGE_TARGET == 'main' } 
                }
            }
            steps {
                echo "Running unit tests for Pull Request targeting 'main'..."
                bat 'npm test'
            }
        }

        stage('Build') {
            when {
                allOf {
                    branch 'main'
                    not { changeRequest() } 
                }
            }
            steps {
                echo "Building project on main..."
                bat 'npm run build'
            }
        }

        stage('Deploy (Vercel)') {
            when {
                allOf {
                    branch 'main'
                    not { changeRequest() }
                }
            }
            environment {
                VERCEL_TOKEN = credentials('vercel-token')
            }
            steps {
                echo "Deploying to Vercel production..."
                bat 'npm install -g vercel'
                bat 'npx vercel --prod --yes --token=%VERCEL_TOKEN% --name=ci-cd-demo'
            }
        }
    }

    post {
        failure {
            echo "❌ Pipeline thất bại. Vui lòng kiểm tra lại!"
        }
        success {
            echo "✅ Pipeline hoạt động thành công!"
        }
        aborted {
            echo "⚠️ Pipeline bị hủy."
        }
    }
}
