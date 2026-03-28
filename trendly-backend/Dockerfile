# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build jar
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Run app
CMD ["java", "-jar", "target/*.jar"]