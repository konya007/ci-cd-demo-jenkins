pipeline {
    agent any
    stages {
        stage('Cài đặt dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Kiểm thử Pull Request vào Main') {
            when {
                allOf {
                    changeRequest true // Điều kiện này đúng nếu đây là một build của PR
                    expression { return env.CHANGE_TARGET == 'main' } 
                }
            }
            steps {
                echo "Running unit tests for Pull Request targeting 'main' branch..."
                bat 'npm test'
            }
        }
        stage('Build và Deploy từ Main') {
            when {
                allOf {
                    branch 'main'
                    not { changeRequest true } // Đảm bảo đây không phải là build của PR
                }
            }
            steps {
                echo "Building and deploying from 'main' branch after merge..."
                bat 'npm run build'
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
    }
}
