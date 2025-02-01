import { useEffect, useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface UserProfile {
  name: string;
  email: string;
  height: Array<{ height: number; date: string }>;
  weight: Array<{ weight: number; date: string }>;
  age?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    height: "",
    weight: "",
    age: "",
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user profile
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to use this page.");
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/profile/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data: UserProfile = await response.json();
        
        // Set initial form data with most recent values
        setFormData({
          name: data.name || "",
          email: data.email || "",
          height: data.height?.length ? data.height[data.height.length - 1].height.toString() : "",
          weight: data.weight?.length ? data.weight[data.weight.length - 1].weight.toString() : "",
          age: data.age || "",
        });
      } catch (error) {
        toast.error("Error loading profile");
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate numeric inputs
    const height = Number(formData.height);
    const weight = Number(formData.weight);
    
    if (formData.height && isNaN(height)) {
      toast.error("Height must be a valid number");
      return;
    }
    
    if (formData.weight && isNaN(weight)) {
      toast.error("Weight must be a valid number");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name || undefined,
          email: formData.email || undefined,
          height: formData.height ? Number(formData.height) : undefined,
          weight: formData.weight ? Number(formData.weight) : undefined,
          age: formData.age || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();
      toast.success("Profile updated successfully");
      console.log("Profile updated successfully:", result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating profile");
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-card">
          <h1 className="profile-title">Profile Settings</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="Enter your name" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="form-input" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="height" className="form-label">Height (cm)</label>
                <input 
                  id="height" 
                  type="number" 
                  placeholder="Enter your height" 
                  className="form-input" 
                  value={formData.height} 
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight" className="form-label">Weight (kg)</label>
                <input 
                  id="weight" 
                  type="number" 
                  placeholder="Enter your weight" 
                  className="form-input" 
                  value={formData.weight} 
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age" className="form-label">Age</label>
                <input 
                  id="age" 
                  type="number" 
                  placeholder="Enter your age" 
                  className="form-input" 
                  value={formData.age} 
                  onChange={handleChange}
                  min="0"
                  max="150"
                />
              </div>
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="button button-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="button button-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}