const getTerms = (req, res) => {
  try {
    const data = `
        **Mobile App Terms and Conditions**
        
        **Last Updated: [Date]**
        
        Please read these terms and conditions carefully before using our mobile application ("App"). By downloading, installing, or using the App, you agree to comply with and be bound by these terms. If you do not agree with these terms, please do not use the App.
        
        **1. License to Use**
        
        1.1. We grant you a limited, non-exclusive, non-transferable, revocable license to use the App solely for your personal, non-commercial purposes.
        
        1.2. You agree not to:
           - Use the App for any unlawful purpose.
           - Modify, adapt, or hack the App or otherwise attempt to gain unauthorized access to the App or its related systems.
           - Use the App in any way that may disrupt or interfere with its functionality.
        
        **2. User Accounts**
        
        2.1. Some features of the App may require you to create a user account. You are responsible for maintaining the security of your account and for any actions taken under your account.
        
        2.2. You must provide accurate and complete information when creating your account. Failure to do so may result in the termination of your account.
        
        **3. Privacy**
        
        3.1. Your use of the App is also governed by our Privacy Policy, which is available on our website.
        
        **4. Content and Intellectual Property**
        
        4.1. The App and its content, including text, images, and software, are protected by copyright and other intellectual property rights. You may not use, modify, distribute, or reproduce any of the content without our explicit permission.
        
        **5. Third-Party Services**
        
        5.1. The App may include links or features that interact with third-party services. We are not responsible for the availability or quality of these services, and your use of such services is subject to the terms and policies of the third-party providers.
        
        **6. Termination**
        
        6.1. We reserve the right to terminate or suspend your access to the App, without notice, if you violate these terms or engage in any activity that we deem harmful to other users or the App itself.
        
        **7. Disclaimers**
        
        7.1. The App is provided "as is" without any warranties, express or implied. We do not warrant that the App will be error-free or uninterrupted.
        
        **8. Limitation of Liability**
        
        8.1. We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the App.
        
        **9. Changes to Terms**
        
        9.1. We may update these terms at any time. Any changes will be effective immediately upon posting within the App. Your continued use of the App after such changes constitutes acceptance of the updated terms.
        
        **10. Governing Law**
        
        10.1. These terms are governed by and construed in accordance with the laws of [Your Jurisdiction].
        
        **11. Contact Information**
        
        11.1. If you have any questions or concerns about these terms, please contact us at [Your Contact Information].
        
        By using our mobile App, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
        `;
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
module.exports = { getTerms };
