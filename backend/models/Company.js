const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
	companyName: String,
	companyWebsite: String,
	companyDescription: String,
	companyLogo: String,
	companyIndustry: String,
	companyHeadquarters: String,
	dateFounded: String
});

// Find company by name
CompanySchema.statics.findCompanyIdByName = async (companyName) => {
	const company = await Company.findOne({ companyName });
	if (!company) {
		throw new Error('Company not found');
	}
	return company._id;
}

// Find company name by id
CompanySchema.statics.findCompanyNameById = async (companyId) => {
	const company = await Company.findOne({ _id: companyId });
	if (!company) {
		throw new Error('Company not found');
	}

	return company.companyName;
}

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
